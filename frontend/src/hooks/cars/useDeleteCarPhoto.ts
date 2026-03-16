import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useDeleteCarPhoto(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => apiClient.delete(`/cars/${carId}/photos/${photoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.detail(carId) });
    }
  });
}
