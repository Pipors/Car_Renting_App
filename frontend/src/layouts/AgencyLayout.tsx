import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function AgencyLayout() {
  const user = useAuthStore((s) => s.user);
  const agencyLabel = user?.agency?.name
    ? `Agency - ${user.agency.name}`
    : `Agency - ${user?.firstName ?? "Account"}`;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-brand-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold text-brand-700">{agencyLabel}</h2>
        <nav className="space-y-2 text-sm">
          <Link className="block" to="/agency/dashboard">Dashboard</Link>
          <Link className="block" to="/agency/listings">Listings</Link>
          <Link className="block" to="/agency/bookings">Booking Queue</Link>
          <Link className="block" to="/agency/profile">Profile</Link>
        </nav>
      </aside>
      <main className="p-6">
        {user?.agency && user.agency.isApproved === false ? (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Your agency is pending approval. Listings may not be visible yet.
          </div>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}
