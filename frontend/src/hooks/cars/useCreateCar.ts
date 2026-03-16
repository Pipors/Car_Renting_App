import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const form = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, String(value));
        }
      });
      const res = await apiClient.post("/cars", form, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.all });
      toast.success("Listing created");
    }
  });
}
