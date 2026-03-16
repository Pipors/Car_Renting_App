import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

export async function useRefreshToken() {
  const res = await apiClient.post("/auth/refresh");
  const token = res.data?.data?.accessToken as string;
  if (token) {
    useAuthStore.getState().setToken(token);
  }
  return token;
}
