import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingsService } from "@/services";
import { Booking, BookingStatus } from "@/types";

const statusVariant: Record<BookingStatus, "default" | "warning" | "success" | "destructive" | "secondary" | "outline"> = {
  PENDING: "warning",
  APPROVED: "default",
  ACTIVE: "success",
  COMPLETED: "secondary",
  REJECTED: "destructive",
  CANCELLED: "destructive",
};

export function RenterBookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["renter-bookings"],
    queryFn: bookingsService.list,
  });

  const payMutation = useMutation({
    mutationFn: (bookingId: string) => bookingsService.payDeposit(bookingId),
    onSuccess: (data) => {
      // In a real app, redirect to Stripe Checkout or use Elements
      alert(`Payment initiated. Client secret: ${data.clientSecret}`);
      queryClient.invalidateQueries({ queryKey: ["renter-bookings"] });
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading bookings...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {!bookings?.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No bookings yet.</p>
          <Button className="mt-4" asChild>
            <Link to="/cars">Browse Cars</Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {bookings?.map((booking: Booking) => (
          <Card key={booking.id}>
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {booking.car?.make} {booking.car?.model} ({booking.car?.year})
                    </p>
                    <Badge variant={statusVariant[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.agency?.companyName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString()} –{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Total: <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
                    {booking.depositPaid ? (
                      <Badge variant="success" className="ml-2 text-xs">Deposit Paid</Badge>
                    ) : (
                      <Badge variant="warning" className="ml-2 text-xs">Deposit Pending</Badge>
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  {booking.status === "APPROVED" && !booking.depositPaid && (
                    <Button
                      size="sm"
                      onClick={() => payMutation.mutate(booking.id)}
                      disabled={payMutation.isPending}
                    >
                      Pay Deposit (${booking.depositAmount})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
