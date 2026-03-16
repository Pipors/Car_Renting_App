import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export function usePaymentConfirm() {
  return useMutation({
    mutationFn: async (payload: { bookingId: string; paymentIntentId: string }) => {
      const res = await apiClient.post("/payments/confirm", payload);
      return res.data;
    }
  });
}
