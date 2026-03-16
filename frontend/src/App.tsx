import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import RouteErrorBoundary from "@/components/shared/RouteErrorBoundary";
import PublicLayout from "@/layouts/PublicLayout";
import HomePage from "@/pages/public/HomePage";

const SearchPage = lazy(() => import("@/pages/public/SearchPage"));
const CarDetailPage = lazy(() => import("@/pages/public/CarDetailPage"));
const PublicAgencyProfilePage = lazy(() => import("@/pages/public/AgencyProfilePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const RenterLayout = lazy(() => import("@/layouts/RenterLayout"));
const AgencyLayout = lazy(() => import("@/layouts/AgencyLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const MyBookingsPage = lazy(() => import("@/pages/renter/MyBookingsPage"));
const RenterBookingDetailPage = lazy(() => import("@/pages/renter/BookingDetailPage"));
const BookingCheckoutPage = lazy(() => import("@/pages/renter/BookingCheckoutPage"));
const MyReputationPage = lazy(() => import("@/pages/renter/MyReputationPage"));
const RenterProfilePage = lazy(() => import("@/pages/renter/ProfilePage"));
const AgencyDashboardPage = lazy(() => import("@/pages/agency/DashboardPage"));
const ListingsPage = lazy(() => import("@/pages/agency/ListingsPage"));
const CreateListingPage = lazy(() => import("@/pages/agency/CreateListingPage"));
const EditListingPage = lazy(() => import("@/pages/agency/EditListingPage"));
const BookingQueuePage = lazy(() => import("@/pages/agency/BookingQueuePage"));
const AgencyBookingDetailPage = lazy(() => import("@/pages/agency/BookingDetailPage"));
const AgencyProfilePage = lazy(() => import("@/pages/agency/AgencyProfilePage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const UsersPage = lazy(() => import("@/pages/admin/UsersPage"));
const AgenciesPage = lazy(() => import("@/pages/admin/AgenciesPage"));
const BookingsPage = lazy(() => import("@/pages/admin/BookingsPage"));
const DisputesPage = lazy(() => import("@/pages/admin/DisputesPage"));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

const routeErrorElement = <RouteErrorBoundary />;

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: routeErrorElement,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: withSuspense(<SearchPage />) },
      { path: "cars/:id", element: withSuspense(<CarDetailPage />) },
      { path: "agencies/:id", element: withSuspense(<PublicAgencyProfilePage />) }
    ]
  },
  {
    path: "/auth",
    element: <Outlet />,
    errorElement: routeErrorElement,
    children: [
      { path: "login", element: withSuspense(<LoginPage />) },
      { path: "register", element: withSuspense(<RegisterPage />) },
      { path: "forgot-password", element: withSuspense(<ForgotPasswordPage />) },
      { path: "reset-password", element: withSuspense(<ResetPasswordPage />) }
    ]
  },
  {
    path: "/renter",
    element: <ProtectedRoute role="RENTER" />,
    errorElement: routeErrorElement,
    children: [
      {
        element: withSuspense(<RenterLayout />),
        children: [
          { path: "dashboard", element: withSuspense(<MyBookingsPage />) },
          { path: "bookings", element: withSuspense(<MyBookingsPage />) },
          { path: "bookings/:id", element: withSuspense(<RenterBookingDetailPage />) },
          { path: "bookings/:id/checkout", element: withSuspense(<BookingCheckoutPage />) },
          { path: "reputation", element: withSuspense(<MyReputationPage />) },
          { path: "profile", element: withSuspense(<RenterProfilePage />) }
        ]
      }
    ]
  },
  {
    path: "/agency",
    element: <ProtectedRoute role="AGENCY" />,
    errorElement: routeErrorElement,
    children: [
      {
        element: withSuspense(<AgencyLayout />),
        children: [
          { path: "dashboard", element: withSuspense(<AgencyDashboardPage />) },
          { path: "listings", element: withSuspense(<ListingsPage />) },
          { path: "listings/new", element: withSuspense(<CreateListingPage />) },
          { path: "listings/:id/edit", element: withSuspense(<EditListingPage />) },
          { path: "bookings", element: withSuspense(<BookingQueuePage />) },
          { path: "bookings/:id", element: withSuspense(<AgencyBookingDetailPage />) },
          { path: "profile", element: withSuspense(<AgencyProfilePage />) }
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute role="ADMIN" />,
    errorElement: routeErrorElement,
    children: [
      {
        element: withSuspense(<AdminLayout />),
        children: [
          { path: "dashboard", element: withSuspense(<AdminDashboardPage />) },
          { path: "users", element: withSuspense(<UsersPage />) },
          { path: "agencies", element: withSuspense(<AgenciesPage />) },
          { path: "bookings", element: withSuspense(<BookingsPage />) },
          { path: "disputes", element: withSuspense(<DisputesPage />) }
        ]
      }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
