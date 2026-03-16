import { Link, Outlet } from "react-router-dom";

export default function RenterLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-brand-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold text-brand-700">Renter</h2>
        <nav className="space-y-2 text-sm">
          <Link className="block" to="/renter/dashboard">Dashboard</Link>
          <Link className="block" to="/renter/bookings">My Bookings</Link>
          <Link className="block" to="/renter/reputation">My Reputation</Link>
          <Link className="block" to="/renter/profile">Profile</Link>
        </nav>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
