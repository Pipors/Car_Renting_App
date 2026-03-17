import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axios";
import { bookingsKeys } from "./useMyBookings";

export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.post(`/bookings/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
      toast.success("Booking marked as returned");
    },
    onError: () => {
      toast.error("Unable to mark booking as returned");
    }
  });
}
