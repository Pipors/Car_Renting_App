import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const { photos, ...payload } = input as { photos?: File[] } & Record<string, unknown>;
      const form = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          form.append(key, JSON.stringify(value));
          return;
        }
        form.append(key, String(value));
      });

      (photos ?? []).forEach((file) => {
        form.append("photos", file);
      });

      const res = await apiClient.post("/cars", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.all });
      toast.success("Listing created");
    },
    onError: () => {
      toast.error("Failed to create listing");
    }
  });
}
