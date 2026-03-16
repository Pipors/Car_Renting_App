import { useAdminDisputes } from "@/hooks/admin/useAdminDisputes";

export default function DisputesPage() {
  const disputes = useAdminDisputes({ status: "OPEN" });
  return <pre className="rounded border bg-white p-3 text-xs">{JSON.stringify(disputes.data, null, 2)}</pre>;
}
