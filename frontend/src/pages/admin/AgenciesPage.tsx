import { useAdminAgencies } from "@/hooks/admin/useAdminAgencies";

export default function AgenciesPage() {
  const data = useAdminAgencies({});
  return <pre className="rounded border bg-white p-3 text-xs">{JSON.stringify(data.data, null, 2)}</pre>;
}
