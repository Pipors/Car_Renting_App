import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { queryClient } from "@/lib/queryClient";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

type RootErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class RootErrorBoundary extends React.Component<React.PropsWithChildren, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    hasError: false,
    message: ""
  };

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unknown runtime error"
    };
  }

  componentDidCatch(error: unknown) {
    console.error("Root render error:", error);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{ padding: 24, fontFamily: "Segoe UI, sans-serif" }}>
        <h1 style={{ marginBottom: 8 }}>Frontend crashed at runtime</h1>
        <p style={{ marginBottom: 12 }}>Open browser console for full stack trace.</p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f8fafc", padding: 12, borderRadius: 8 }}>
          {this.state.message}
        </pre>
      </div>
    );
  }
}

async function bootstrapAuth() {
  const token = useAuthStore.getState().accessToken;
  if (!token) return;
  try {
    const res = await apiClient.post("/auth/refresh");
    const newToken = res.data?.data?.accessToken as string | undefined;
    if (newToken) {
      useAuthStore.getState().setToken(newToken);
    }
  } catch {
    useAuthStore.getState().clearAuth();
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);

void bootstrapAuth();
