import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Agency Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Listings", "-"],
          ["Pending bookings", "-"],
          ["Active rentals", "-"],
          ["Monthly revenue", "-"]
        ].map(([k, v]) => (
          <div key={k} className="rounded border bg-white p-3">
            <p className="text-xs text-slate-600">{k}</p>
            <p className="text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Link to="/agency/listings/new" className="rounded bg-brand-600 px-3 py-2 text-sm text-white">Add new listing</Link>
        <Link to="/agency/bookings" className="rounded border px-3 py-2 text-sm">View booking queue</Link>
      </div>
    </div>
  );
}
