import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { reviewsKeys } from "./useAgencyReviews";

export function useSubmitReview(agencyId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { bookingId: string; rating: number; comment: string }) => {
      const res = await apiClient.post("/reviews/agency", payload);
      return res.data;
    },
    onSuccess: () => {
      if (agencyId) {
        queryClient.invalidateQueries({ queryKey: reviewsKeys.agency(agencyId, {}) });
      }
      toast.success("Review submitted");
    }
  });
}
