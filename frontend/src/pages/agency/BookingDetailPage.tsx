import { useParams } from "react-router-dom";
import RaterModal from "@/components/reputation/RaterModal";
import { useBooking } from "@/hooks/bookings/useBooking";

export default function BookingDetailPage() {
  const { id } = useParams();
  const booking = useBooking(id);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Agency Booking Detail</h1>
      <pre className="rounded border bg-white p-3 text-xs">{JSON.stringify(booking.data, null, 2)}</pre>
      {id ? <RaterModal bookingId={id} /> : null}
    </div>
  );
}
