import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, Booking } from "@/types/api.types";

export const bookingsKeys = {
  all: ["bookings"] as const,
  my: (params: Record<string, unknown>) => ["bookings", "my", params] as const,
  agency: (params: Record<string, unknown>) => ["bookings", "agency", params] as const,
  detail: (id: string) => ["bookings", "detail", id] as const
};

export function useMyBookings(params: Record<string, unknown>) {
  return useQuery({
    queryKey: bookingsKeys.my(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Booking[]>>("/bookings/me", { params });
      return res.data;
    }
  });
}
