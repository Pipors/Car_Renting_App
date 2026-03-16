import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, Booking } from "@/types/api.types";
import { bookingsKeys } from "./useMyBookings";

export function useAgencyBookings(params: Record<string, unknown>) {
  return useQuery({
    queryKey: bookingsKeys.agency(params),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Booking[]>>("/bookings/agencies/me/bookings", { params });
      return res.data;
    }
  });
}
