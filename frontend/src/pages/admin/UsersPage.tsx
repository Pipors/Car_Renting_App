import { useAdminUsers } from "@/hooks/admin/useAdminUsers";

export default function UsersPage() {
  const users = useAdminUsers({});
  return <pre className="rounded border bg-white p-3 text-xs">{JSON.stringify(users.data, null, 2)}</pre>;
}
