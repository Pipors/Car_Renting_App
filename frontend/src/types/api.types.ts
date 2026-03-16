export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  response?: {
    data?: {
      error?: {
        code: string;
        message: string;
        details?: Array<{ field: string; message: string }>;
      };
    };
    status: number;
  };
  message: string;
}

export type UserType = "RENTER" | "AGENCY" | "ADMIN";
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Agency {
  id: string;
  name: string;
  city: string;
  country?: string;
  isApproved?: boolean;
  avgRating?: number;
  totalReviews?: number;
}

export interface User {
  id: string;
  email: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneVerified?: boolean;
  isVerified?: boolean;
  agency?: Agency;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  city: string;
  type: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay: string;
  depositAmount: string;
  primaryPhoto?: string | null;
  features?: string[];
  agency?: Agency;
}

export interface Booking {
  id: string;
  carId: string;
  renterId: string;
  agencyId: string;
  status: BookingStatus;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalAmount: string;
  depositAmount: string;
  notes?: string;
  car?: Car;
  paymentIntent?: { clientSecret: string };
}
