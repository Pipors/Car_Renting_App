import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { carsService } from "@/services";

const schema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  pricePerDay: z.coerce.number().positive("Must be positive"),
  depositAmount: z.coerce.number().positive("Must be positive"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PostCarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const fd = new FormData();
      fd.append("make", values.make);
      fd.append("model", values.model);
      fd.append("year", String(values.year));
      fd.append("pricePerDay", String(values.pricePerDay));
      fd.append("depositAmount", String(values.depositAmount));
      if (values.description) fd.append("description", values.description);
      if (imageFile) fd.append("image", imageFile);
      return carsService.create(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency-cars"] });
      navigate("/agency/dashboard");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setServerError(err.response?.data?.message ?? "Failed to create car");
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>
      <Card>
        <CardHeader>
          <CardTitle>Car Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="make">Make</Label>
                <Input id="make" {...register("make")} placeholder="Toyota" />
                {errors.make && <p className="text-xs text-destructive">{errors.make.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="model">Model</Label>
                <Input id="model" {...register("model")} placeholder="Camry" />
                {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" {...register("year")} placeholder="2023" />
                {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pricePerDay">Price / Day ($)</Label>
                <Input id="pricePerDay" type="number" step="0.01" {...register("pricePerDay")} placeholder="89.99" />
                {errors.pricePerDay && <p className="text-xs text-destructive">{errors.pricePerDay.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="depositAmount">Deposit ($)</Label>
                <Input id="depositAmount" type="number" step="0.01" {...register("depositAmount")} placeholder="500" />
                {errors.depositAmount && <p className="text-xs text-destructive">{errors.depositAmount.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="image">Car Photo (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded-md border"
                />
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                {...register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe the car..."
              />
            </div>

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Add Car"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
