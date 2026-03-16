import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r border-brand-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold text-brand-700">Admin</h2>
        <nav className="space-y-2 text-sm">
          <Link className="block" to="/admin/dashboard">Dashboard</Link>
          <Link className="block" to="/admin/users">Users</Link>
          <Link className="block" to="/admin/agencies">Agencies</Link>
          <Link className="block" to="/admin/bookings">Bookings</Link>
          <Link className="block" to="/admin/disputes">Disputes</Link>
        </nav>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
