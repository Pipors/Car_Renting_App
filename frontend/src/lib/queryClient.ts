import { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      onError: (err: any) => {
        const message = err?.response?.data?.error?.message ?? err?.message ?? "Something went wrong";
        toast.error(message);
      }
    }
  }
});
