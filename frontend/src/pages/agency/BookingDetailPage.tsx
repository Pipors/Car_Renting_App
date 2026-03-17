import { useParams } from "react-router-dom";
import RaterModal from "@/components/reputation/RaterModal";
import { useBooking } from "@/hooks/bookings/useBooking";
import { useCompleteBooking } from "@/hooks/bookings/useCompleteBooking";

export default function BookingDetailPage() {
  const { id } = useParams();
  const booking = useBooking(id);
  const completeBooking = useCompleteBooking();

  const canSetReturned =
    booking.data &&
    (booking.data.status === "APPROVED" || booking.data.status === "ACTIVE");

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Agency Booking Detail</h1>
      {id ? (
        <button
          type="button"
          className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => completeBooking.mutate(id)}
          disabled={!canSetReturned || completeBooking.isPending}
        >
          {completeBooking.isPending ? "Updating..." : "Set as returned"}
        </button>
      ) : null}
      <pre className="rounded border bg-white p-3 text-xs">{JSON.stringify(booking.data, null, 2)}</pre>
      {id ? <RaterModal bookingId={id} /> : null}
    </div>
  );
}
