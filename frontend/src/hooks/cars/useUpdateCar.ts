import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useUpdateCar(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await apiClient.put(`/cars/${id}`, input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: carsKeys.all });
      toast.success("Listing updated");
    }
  });
}
