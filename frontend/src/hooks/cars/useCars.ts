import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, Car } from "@/types/api.types";

export type CarsParams = {
  city?: string;
  pickupDate?: string;
  returnDate?: string;
  type?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  minAgencyRating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
};

export const carsKeys = {
  all: ["cars"] as const,
  list: (params: CarsParams) => ["cars", "list", params] as const,
  detail: (id: string) => ["cars", "detail", id] as const,
  agency: (agencyId: string, params: Record<string, unknown>) => ["cars", "agency", agencyId, params] as const
};

export function useCars(params: CarsParams) {
  return useQuery({
    queryKey: carsKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Car[]>>("/cars", { params });
      return res.data;
    },
    staleTime: 60_000
  });
}
