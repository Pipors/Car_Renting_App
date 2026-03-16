import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-brand-700">CarRent</Link>
          <nav className="flex gap-4 text-sm text-slate-700">
            <Link to="/search">Search</Link>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
