import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, Car } from "@/types/api.types";
import { carsKeys } from "./useCars";

export function useMyAgencyCars(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: carsKeys.agency("me", params),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Car[]>>("/cars/agencies/me/cars", { params });
      return res.data;
    }
  });
}
