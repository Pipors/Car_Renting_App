import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, Booking } from "@/types/api.types";
import { bookingsKeys } from "./useMyBookings";

export function useBooking(id?: string) {
  return useQuery({
    queryKey: bookingsKeys.detail(id ?? ""),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id)
  });
}
