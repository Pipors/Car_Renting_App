export type JwtPayload = {
  userId: string;
  role: "AGENCY" | "RENTER";
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
