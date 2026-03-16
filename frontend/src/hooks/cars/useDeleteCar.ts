import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useDeleteCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/cars/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.all });
      toast.success("Listing deleted");
    }
  });
}
