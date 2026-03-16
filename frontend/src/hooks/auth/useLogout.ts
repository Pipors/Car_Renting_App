import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => apiClient.post("/auth/logout"),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate("/auth/login");
    }
  });
}
