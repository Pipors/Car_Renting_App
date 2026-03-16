import { useSearchParams } from "react-router-dom";
import BookingCard from "@/components/bookings/BookingCard";
import EmptyState from "@/components/shared/EmptyState";
import { useMyBookings } from "@/hooks/bookings/useMyBookings";

export default function MyBookingsPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? undefined;
  const query = useMyBookings({ status, page: Number(params.get("page") ?? 1) });
  const bookings = query.data?.data ?? [];

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        {["", "PENDING", "APPROVED", "ACTIVE", "COMPLETED", "CANCELLED"].map((s) => (
          <button
            key={s || "ALL"}
            className="rounded border px-2 py-1 text-xs"
            onClick={() => {
              const next = new URLSearchParams(params);
              if (!s) next.delete("status");
              else next.set("status", s);
              setParams(next);
            }}
          >
            {s || "ALL"}
          </button>
        ))}
      </div>
      {bookings.length === 0 ? <EmptyState title="No bookings yet" /> : null}
      <div className="grid gap-3">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} href={`/renter/bookings/${b.id}`} />
        ))}
      </div>
    </section>
  );
}
