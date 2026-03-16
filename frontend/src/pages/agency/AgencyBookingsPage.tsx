import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingsService, ratingsService } from "@/services";
import { Booking, BookingStatus } from "@/types";

const statusVariant: Record<BookingStatus, "default" | "warning" | "success" | "destructive" | "secondary" | "outline"> = {
  PENDING: "warning",
  APPROVED: "default",
  ACTIVE: "success",
  COMPLETED: "secondary",
  REJECTED: "destructive",
  CANCELLED: "destructive",
};

function RateRenterModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      ratingsService.rateRenter({ bookingId: booking.id, score, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency-bookings"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm mx-4">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Rate Renter</h3>
          <p className="text-sm text-muted-foreground">
            {booking.renter?.user.name}
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium">Score (1–5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setScore(s)}
                  className={`w-9 h-9 rounded-full border-2 text-sm font-bold transition-colors ${
                    score >= s
                      ? "bg-yellow-400 border-yellow-400 text-white"
                      : "border-input"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Comment (optional)</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending ? "Submitting..." : "Submit Rating"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AgencyBookingsPage() {
  const queryClient = useQueryClient();
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["agency-bookings"],
    queryFn: bookingsService.list,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingsService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agency-bookings"] }),
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading bookings...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bookings</h1>

      {!bookings?.length && (
        <p className="text-muted-foreground">No bookings yet.</p>
      )}

      <div className="space-y-3">
        {bookings?.map((booking) => (
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
                    Renter: {booking.renter?.user.name} ({booking.renter?.user.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString()} –{" "}
                    {new Date(booking.endDate).toLocaleDateString()} •{" "}
                    <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
                  </p>
                  {booking.renter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      asChild
                    >
                      <Link to={`/agency/renters/${booking.renter.id}/reputation`}>
                        View Renter Reputation
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {booking.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          statusMutation.mutate({ id: booking.id, status: "APPROVED" })
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          statusMutation.mutate({ id: booking.id, status: "REJECTED" })
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {booking.status === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        statusMutation.mutate({ id: booking.id, status: "ACTIVE" })
                      }
                    >
                      Mark Active
                    </Button>
                  )}
                  {booking.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        statusMutation.mutate({ id: booking.id, status: "COMPLETED" })
                      }
                    >
                      Mark Completed
                    </Button>
                  )}
                  {booking.status === "COMPLETED" && !booking.rating && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRatingBooking(booking)}
                    >
                      ⭐ Rate Renter
                    </Button>
                  )}
                  {booking.status === "COMPLETED" && booking.rating && (
                    <Badge variant="secondary">
                      Rated: {booking.rating.score}/5
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ratingBooking && (
        <RateRenterModal
          booking={ratingBooking}
          onClose={() => setRatingBooking(null)}
        />
      )}
    </div>
  );
}
