import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiResponse, Booking } from "@/types/api.types";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: { carId: string; pickupDate: string; returnDate: string; notes?: string }) => {
      const res = await apiClient.post<ApiResponse<Booking>>("/bookings", payload);
      return res.data.data;
    }
  });
}
