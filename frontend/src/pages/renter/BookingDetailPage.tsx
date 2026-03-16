import { useParams } from "react-router-dom";
import { useBooking } from "@/hooks/bookings/useBooking";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";

export default function BookingDetailPage() {
  const { id } = useParams();
  const bookingQuery = useBooking(id);
  const booking = bookingQuery.data;

  if (!booking) return <div className="rounded border bg-white p-4">Loading booking...</div>;

  return (
    <div className="rounded-xl border bg-white p-4">
      <h1 className="text-xl font-bold">Booking {booking.id.slice(0, 8)}</h1>
      <div className="mt-2"><BookingStatusBadge status={booking.status} /></div>
      <p className="mt-2 text-sm">{booking.pickupDate} to {booking.returnDate}</p>
      <p className="text-sm">Total: {booking.totalAmount}</p>
    </div>
  );
}
