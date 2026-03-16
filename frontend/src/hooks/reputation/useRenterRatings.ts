import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { reputationKeys } from "./useRenterReputation";

export function useRenterRatings(renterId?: string, params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: reputationKeys.ratings(renterId ?? "", params),
    queryFn: async () => {
      const res = await apiClient.get(`/reputation/renters/${renterId}/ratings`, { params });
      return res.data;
    },
    enabled: Boolean(renterId)
  });
}
