import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { adminKeys } from "./useAdminUsers";

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resolution, adminNotes, removeRating }: { id: string; resolution: "RESOLVED" | "DISMISSED"; adminNotes?: string; removeRating?: boolean }) => {
      const res = await apiClient.patch(`/admin/disputes/${id}/resolve`, { resolution, adminNotes, removeRating });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.disputes({}) });
    }
  });
}
