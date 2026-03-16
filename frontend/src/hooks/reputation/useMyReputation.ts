import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { reputationKeys } from "./useRenterReputation";

export function useMyReputation() {
  return useQuery({
    queryKey: reputationKeys.me,
    queryFn: async () => {
      const res = await apiClient.get("/reputation/me");
      return res.data;
    }
  });
}
