import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiResponse, User } from "@/types/api.types";

type RegisterData = { user: User; accessToken: string };

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await apiClient.post<ApiResponse<RegisterData>>("/auth/register", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      if (data.user.userType === "RENTER") navigate("/renter/dashboard");
      if (data.user.userType === "AGENCY") navigate("/agency/dashboard");
      if (data.user.userType === "ADMIN") navigate("/admin/dashboard");
    }
  });
}
