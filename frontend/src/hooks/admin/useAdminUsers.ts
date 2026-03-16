import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const adminKeys = {
  users: (params: Record<string, unknown>) => ["admin", "users", params] as const,
  agencies: (params: Record<string, unknown>) => ["admin", "agencies", params] as const,
  disputes: (params: Record<string, unknown>) => ["admin", "disputes", params] as const
};

export function useAdminUsers(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: async () => {
      const res = await apiClient.get("/admin/users", { params });
      return res.data;
    }
  });
}
