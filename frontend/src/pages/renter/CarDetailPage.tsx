import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { carsService, bookingsService } from "@/services";

const schema = z
  .object({
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof schema>;

export function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carsService.get(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const days =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      bookingsService.create({
        carId: id!,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      }),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["renter-bookings"] });
      navigate(`/renter/bookings/${booking.id}`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setServerError(err.response?.data?.message ?? "Failed to create booking");
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (!car) return <p className="text-destructive">Car not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {car.imageUrl ? (
            <img
              src={car.imageUrl}
              alt={`${car.make} ${car.model}`}
              className="w-full rounded-lg object-cover max-h-64"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-bold">
              {car.make} {car.model}
            </h1>
            <p className="text-muted-foreground">{car.year}</p>
            {car.agency && (
              <p className="text-sm">by {car.agency.companyName}</p>
            )}
            <Badge variant={car.available ? "success" : "secondary"}>
              {car.available ? "Available" : "Unavailable"}
            </Badge>
            <div className="pt-2">
              <p className="text-3xl font-bold">
                ${car.pricePerDay}
                <span className="text-base font-normal text-muted-foreground">/day</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Security deposit: ${car.depositAmount}
              </p>
            </div>
            {car.description && (
              <p className="text-sm text-muted-foreground pt-2">{car.description}</p>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Book This Car</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit((v) => mutation.mutate(v))}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  min={startDate || new Date().toISOString().split("T")[0]}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">{errors.endDate.message}</p>
                )}
              </div>

              {days > 0 && (
                <div className="rounded-md bg-muted p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{days} day{days !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rental cost</span>
                    <span>${(days * car.pricePerDay).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                    <span>Deposit due now</span>
                    <span>${car.depositAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending || !car.available}
              >
                {mutation.isPending ? "Booking..." : "Request Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
