declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        userType: "RENTER" | "AGENCY" | "ADMIN";
        agencyId?: string;
      };
    }
  }
}

export {};
