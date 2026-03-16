import api from "./api";
import {
  AuthResponse,
  Car,
  Booking,
  BookingStatus,
  RenterReputation,
} from "@/types";

// ─── Auth ────────────────────────────────────────────────────
export const authService = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: "AGENCY" | "RENTER";
    companyName?: string;
  }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),
};

// ─── Cars ────────────────────────────────────────────────────
export const carsService = {
  list: (params?: {
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }) => api.get<Car[]>("/cars", { params }).then((r) => r.data),

  get: (id: string) => api.get<Car>(`/cars/${id}`).then((r) => r.data),

  create: (data: Omit<Car, "id" | "agencyId" | "createdAt" | "available" | "agency">) =>
    api.post<Car>("/cars", data).then((r) => r.data),

  update: (id: string, data: Partial<Car>) =>
    api.put<Car>(`/cars/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/cars/${id}`),
};

// ─── Bookings ────────────────────────────────────────────────
export const bookingsService = {
  list: () => api.get<Booking[]>("/bookings").then((r) => r.data),

  get: (id: string) => api.get<Booking>(`/bookings/${id}`).then((r) => r.data),

  create: (data: { carId: string; startDate: string; endDate: string }) =>
    api.post<Booking>("/bookings", data).then((r) => r.data),

  updateStatus: (id: string, status: BookingStatus) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }).then((r) => r.data),

  payDeposit: (id: string) =>
    api
      .post<{ clientSecret: string }>(`/bookings/${id}/pay`)
      .then((r) => r.data),
};

// ─── Ratings ─────────────────────────────────────────────────
export const ratingsService = {
  rateRenter: (data: { bookingId: string; score: number; comment?: string }) =>
    api.post("/ratings", data).then((r) => r.data),

  getRenterReputation: (renterId: string) =>
    api
      .get<RenterReputation>(`/ratings/renter/${renterId}`)
      .then((r) => r.data),
};
