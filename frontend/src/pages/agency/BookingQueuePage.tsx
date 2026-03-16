import { useAgencyBookings } from "@/hooks/bookings/useAgencyBookings";
import BookingCard from "@/components/bookings/BookingCard";

export default function BookingQueuePage() {
  const bookings = useAgencyBookings({});

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Booking Queue</h1>
      {(bookings.data?.data ?? []).map((b: any) => (
        <BookingCard key={b.id} booking={b} href={`/agency/bookings/${b.id}`} />
      ))}
    </div>
  );
}
