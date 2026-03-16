import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export default function BookingsPage() {
  const query = useQuery({ queryKey: ["admin", "bookings"], queryFn: async () => (await apiClient.get("/admin/bookings")).data });
  return <pre className="rounded border bg-white p-3 text-xs">{JSON.stringify(query.data, null, 2)}</pre>;
}
