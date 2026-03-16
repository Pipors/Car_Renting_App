import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { reputationKeys } from "./useRenterReputation";

export function useDisputeRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ratingId, reason }: { ratingId: string; reason: string }) => {
      const res = await apiClient.post(`/reputation/dispute/${ratingId}`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reputationKeys.me });
      toast.success("Dispute submitted");
    }
  });
}
