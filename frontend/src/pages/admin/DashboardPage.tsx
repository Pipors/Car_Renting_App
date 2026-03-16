export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Total users", "-"],
          ["Agencies", "-"],
          ["Bookings", "-"],
          ["Open disputes", "-"]
        ].map(([k, v]) => (
          <div key={k} className="rounded border bg-white p-3">
            <p className="text-xs text-slate-600">{k}</p>
            <p className="text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
