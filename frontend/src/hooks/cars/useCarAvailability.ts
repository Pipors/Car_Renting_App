import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useUpdateCarAvailability(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blocks: Array<{ startDate: string; endDate: string; reason?: string }>) => {
      const res = await apiClient.put(`/cars/${id}/availability`, { blocks });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.detail(id) });
    }
  });
}
