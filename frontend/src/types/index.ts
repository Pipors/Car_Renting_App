export interface User {
  id: string;
  email: string;
  name: string;
  role: "AGENCY" | "RENTER";
}

export interface Agency {
  id: string;
  userId: string;
  companyName: string;
  phone?: string;
  address?: string;
}

export interface Renter {
  id: string;
  userId: string;
  phone?: string;
  reputationScore: number;
  ratingCount: number;
}

export interface Car {
  id: string;
  agencyId: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  depositAmount: number;
  description?: string;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
  agency?: Pick<Agency, "id" | "companyName">;
}

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;
  carId: string;
  renterId: string;
  agencyId: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  stripePaymentIntentId?: string;
  createdAt: string;
  car?: Car;
  renter?: Renter & { user: Pick<User, "name" | "email"> };
  agency?: Pick<Agency, "companyName">;
  rating?: RenterRating;
}

export interface RenterRating {
  id: string;
  bookingId: string;
  renterId: string;
  agencyId: string;
  score: number;
  comment?: string;
  createdAt: string;
  agency?: Pick<Agency, "companyName">;
}

export interface RenterReputation {
  renterId: string;
  name: string;
  reputationScore: number;
  ratingCount: number;
  ratings: RenterRating[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
