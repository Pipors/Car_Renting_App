import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { bookingsKeys } from "@/hooks/bookings/useMyBookings";

export function useRateRenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { bookingId: string; rating: number; tags: string[]; comment?: string }) => {
      const res = await apiClient.post("/reputation/rate-renter", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    }
  });
}
