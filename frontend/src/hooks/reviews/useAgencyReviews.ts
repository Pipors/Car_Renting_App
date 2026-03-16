import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const reviewsKeys = {
  all: ["reviews"] as const,
  agency: (agencyId: string, params: Record<string, unknown>) => ["reviews", agencyId, params] as const
};

export function useAgencyReviews(agencyId?: string, params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: reviewsKeys.agency(agencyId ?? "", params),
    queryFn: async () => {
      const res = await apiClient.get(`/agencies/${agencyId}/reviews`, { params });
      return res.data;
    },
    enabled: Boolean(agencyId)
  });
}
