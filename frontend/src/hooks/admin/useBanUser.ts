import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { adminKeys } from "./useAdminUsers";

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, banned, reason }: { id: string; banned: boolean; reason?: string }) => {
      const res = await apiClient.patch(`/admin/users/${id}/ban`, { banned, reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users({}) });
    }
  });
}
