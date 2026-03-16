import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { adminKeys } from "./useAdminUsers";

export function useAdminAgencies(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: adminKeys.agencies(params),
    queryFn: async () => {
      const res = await apiClient.get("/admin/agencies", { params });
      return res.data;
    }
  });
}
