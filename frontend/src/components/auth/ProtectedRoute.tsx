import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserType } from "@/types/api.types";
import { useAuthStore } from "@/stores/auth.store";

type Props = { role: UserType };

const defaultPathByRole: Record<UserType, string> = {
  RENTER: "/renter/dashboard",
  AGENCY: "/agency/dashboard",
  ADMIN: "/admin/dashboard"
};

export function ProtectedRoute({ role }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user.userType !== role) {
    return <Navigate to={defaultPathByRole[user.userType]} replace />;
  }

  return <Outlet />;
}
