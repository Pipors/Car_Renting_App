import { Link } from "react-router-dom";
import type { Booking } from "@/types/api.types";
import BookingStatusBadge from "./BookingStatusBadge";

export default function BookingCard({ booking, href }: { booking: Booking; href: string }) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h3>
        <BookingStatusBadge status={booking.status} />
      </div>
      <p className="mt-1 text-sm text-slate-600">{booking.pickupDate} to {booking.returnDate}</p>
      <Link to={href} className="mt-3 inline-block text-sm text-brand-700 underline">Open booking</Link>
    </article>
  );
}
