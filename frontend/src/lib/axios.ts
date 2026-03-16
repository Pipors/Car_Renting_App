import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth.store";

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let queue: QueueItem[] = [];

const flushQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  queue = [];
};

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const refreshResponse = await apiClient.post("/auth/refresh");
      const token = refreshResponse.data?.data?.accessToken as string;
      if (!token) throw new Error("Refresh failed");

      useAuthStore.getState().setToken(token);
      flushQueue(null, token);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${token}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      useAuthStore.getState().clearAuth();
      window.location.href = "/auth/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
