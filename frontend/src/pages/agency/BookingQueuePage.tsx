import { useAgencyBookings } from "@/hooks/bookings/useAgencyBookings";
import BookingCard from "@/components/bookings/BookingCard";
import { useApproveBooking } from "@/hooks/bookings/useApproveBooking";
import { useRejectBooking } from "@/hooks/bookings/useRejectBooking";
import { useCompleteBooking } from "@/hooks/bookings/useCompleteBooking";
import type { Booking } from "@/types/api.types";

export default function BookingQueuePage() {
  const bookings = useAgencyBookings({});
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();
  const completeBooking = useCompleteBooking();

  const rows = (bookings.data?.data ?? []) as Booking[];
  const pendingRows = rows.filter((b) => b.status === "PENDING");
  const rentalRows = rows.filter((b) => b.status === "APPROVED" || b.status === "ACTIVE");

  const onReject = async (id: string) => {
    const reason = window.prompt("Reason for rejection:", "Car unavailable for requested dates");
    if (!reason) return;
    await rejectBooking.mutateAsync({ id, reason });
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Booking Queue</h1>

      {bookings.isLoading ? <div className="rounded border bg-white p-4">Loading requests...</div> : null}
      {!bookings.isLoading && rows.length === 0 ? (
        <div className="rounded border bg-white p-4">No booking requests yet.</div>
      ) : null}

      <h2 className="text-lg font-semibold">Pending Requests</h2>
      {pendingRows.length === 0 ? <div className="rounded border bg-white p-4">No pending requests.</div> : null}

      {pendingRows.map((b: any) => (
        <div key={b.id} className="space-y-2 rounded-xl border bg-white p-3">
          <BookingCard booking={b} href={`/agency/bookings/${b.id}`} />
          <p className="text-sm text-slate-600">
            Requested by: {b.renter ? `${b.renter.firstName} ${b.renter.lastName} (${b.renter.email})` : "Unknown user"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-60"
              onClick={() => approveBooking.mutate(b.id)}
              disabled={approveBooking.isPending || rejectBooking.isPending || completeBooking.isPending}
            >
              Approve
            </button>
            <button
              type="button"
              className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-60"
              onClick={() => onReject(b.id)}
              disabled={approveBooking.isPending || rejectBooking.isPending || completeBooking.isPending}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <h2 className="pt-2 text-lg font-semibold">Approved / Active Rentals</h2>
      {rentalRows.length === 0 ? <div className="rounded border bg-white p-4">No approved or active rentals.</div> : null}

      {rentalRows.map((b) => (
        <div key={b.id} className="space-y-2 rounded-xl border bg-white p-3">
          <BookingCard booking={b} href={`/agency/bookings/${b.id}`} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => completeBooking.mutate(b.id)}
              disabled={completeBooking.isPending || approveBooking.isPending || rejectBooking.isPending}
            >
              Set as returned
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
