import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { adminKeys } from "./useAdminUsers";

export function useApproveAgency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await apiClient.patch(`/admin/agencies/${id}/approve`, { approved });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.agencies({}) });
    }
  });
}
