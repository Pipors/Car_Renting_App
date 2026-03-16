import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const reputationKeys = {
  all: ["reputation"] as const,
  renter: (renterId: string) => ["reputation", "renter", renterId] as const,
  me: ["reputation", "me"] as const,
  ratings: (renterId: string, params: Record<string, unknown>) => ["reputation", "ratings", renterId, params] as const
};

export function useRenterReputation(renterId?: string) {
  return useQuery({
    queryKey: reputationKeys.renter(renterId ?? ""),
    queryFn: async () => {
      const res = await apiClient.get(`/reputation/renters/${renterId}`);
      return res.data;
    },
    enabled: Boolean(renterId)
  });
}
