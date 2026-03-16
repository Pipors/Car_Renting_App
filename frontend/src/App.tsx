import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { AgencyDashboard } from "@/pages/agency/AgencyDashboard";
import { PostCarPage } from "@/pages/agency/PostCarPage";
import { AgencyBookingsPage } from "@/pages/agency/AgencyBookingsPage";
import { RenterReputationPage } from "@/pages/agency/RenterReputationPage";
import { SearchCarsPage } from "@/pages/renter/SearchCarsPage";
import { CarDetailPage } from "@/pages/renter/CarDetailPage";
import { RenterBookingsPage } from "@/pages/renter/RenterBookingsPage";
import { MyReputationPage } from "@/pages/renter/MyReputationPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cars" element={<SearchCarsPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />

            {/* Agency routes */}
            <Route element={<ProtectedRoute role="AGENCY" />}>
              <Route path="/agency/dashboard" element={<AgencyDashboard />} />
              <Route path="/agency/cars/new" element={<PostCarPage />} />
              <Route path="/agency/bookings" element={<AgencyBookingsPage />} />
              <Route
                path="/agency/renters/:renterId/reputation"
                element={<RenterReputationPage />}
              />
            </Route>

            {/* Renter routes */}
            <Route element={<ProtectedRoute role="RENTER" />}>
              <Route path="/renter/bookings" element={<RenterBookingsPage />} />
              <Route path="/renter/reputation" element={<MyReputationPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
