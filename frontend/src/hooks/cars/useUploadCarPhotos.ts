import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";

export function useUploadCarPhotos(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData();
      files.forEach((file) => form.append("photos", file));
      const res = await apiClient.post(`/cars/${id}/photos`, form, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.detail(id) });
    }
  });
}
