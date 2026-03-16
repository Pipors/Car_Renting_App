import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { adminKeys } from "./useAdminUsers";

export function useAdminDisputes(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: adminKeys.disputes(params),
    queryFn: async () => {
      const res = await apiClient.get("/admin/disputes", { params });
      return res.data;
    }
  });
}
