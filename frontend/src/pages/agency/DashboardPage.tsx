import { Link } from "react-router-dom";
import { useAgencyBookings } from "@/hooks/bookings/useAgencyBookings";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";

export default function DashboardPage() {
  const pendingBookingsQuery = useAgencyBookings({ status: "PENDING", page: 1, limit: 50 });
  const approvedBookingsQuery = useAgencyBookings({ status: "APPROVED", page: 1, limit: 50 });
  const activeBookingsQuery = useAgencyBookings({ status: "ACTIVE", page: 1, limit: 50 });

  const pendingCount = pendingBookingsQuery.data?.meta?.total ?? 0;
  const approvedCount = approvedBookingsQuery.data?.meta?.total ?? 0;
  const activeCount = activeBookingsQuery.data?.meta?.total ?? 0;

  const rentedCars = [
    ...(approvedBookingsQuery.data?.data ?? []),
    ...(activeBookingsQuery.data?.data ?? [])
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Agency Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Listings", "-"],
          ["Pending bookings", String(pendingCount)],
          ["Approved rentals", String(approvedCount)],
          ["Active rentals", String(activeCount)],
          ["Monthly revenue", "-"]
        ].map(([k, v]) => (
          <div key={k} className="rounded border bg-white p-3">
            <p className="text-xs text-slate-600">{k}</p>
            <p className="text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="rounded border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cars Currently Rented / Scheduled</h2>
          <Link to="/agency/bookings" className="text-sm text-brand-700 underline">
            Open booking queue
          </Link>
        </div>

        {pendingBookingsQuery.isLoading || approvedBookingsQuery.isLoading || activeBookingsQuery.isLoading ? (
          <p className="text-sm text-slate-600">Loading rentals...</p>
        ) : null}

        {!pendingBookingsQuery.isLoading && !approvedBookingsQuery.isLoading && !activeBookingsQuery.isLoading && rentedCars.length === 0 ? (
          <p className="text-sm text-slate-600">No approved or active rentals yet.</p>
        ) : null}

        {rentedCars.length > 0 ? (
          <div className="space-y-2">
            {rentedCars.map((booking) => (
              <div key={booking.id} className="rounded border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {booking.car ? `${booking.car.make} ${booking.car.model}` : `Car ${booking.carId.slice(0, 8)}`}
                  </p>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {booking.pickupDate} to {booking.returnDate}
                </p>
                <Link to={`/agency/bookings/${booking.id}`} className="mt-2 inline-block text-sm text-brand-700 underline">
                  View booking details
                </Link>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Link to="/agency/listings/new" className="rounded bg-brand-600 px-3 py-2 text-sm text-white">Add new listing</Link>
        <Link to="/agency/bookings" className="rounded border px-3 py-2 text-sm">View booking queue</Link>
      </div>
    </div>
  );
}
