import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { carsKeys } from "./useCars";
import type { ApiResponse, Car } from "@/types/api.types";

export function useCar(id?: string) {
  return useQuery({
    queryKey: carsKeys.detail(id ?? ""),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Car>>(`/cars/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id)
  });
}
