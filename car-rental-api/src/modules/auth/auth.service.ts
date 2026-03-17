import bcrypt from "bcrypt";
import { prisma } from "../../config/database";
import { getRedis } from "../../config/redis";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";

const refreshTokenCookie = "refreshToken";

const makeRefreshExpiresAt = () => {
  const now = new Date();
  now.setHours(now.getHours() + 48);
  return now;
};

const sanitizeUser = (user: {
  id: string;
  email: string;
  userType: "RENTER" | "AGENCY" | "ADMIN";
  firstName: string;
  lastName: string;
  agency?: {
    id: string;
    name: string;
    isApproved: boolean;
  } | null;
}) => ({
  id: user.id,
  email: user.email,
  userType: user.userType,
  firstName: user.firstName,
  lastName: user.lastName,
  agency: user.agency
    ? {
        id: user.agency.id,
        name: user.agency.name,
        isApproved: user.agency.isApproved
      }
    : undefined
});

export const authService = {
  refreshTokenCookie,
  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    userType: "RENTER" | "AGENCY";
    agencyName?: string;
    address?: string;
    city?: string;
    country?: string;
    licenseNumber?: string;
  }) {
    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          userType: input.userType
        }
      });

      if (input.userType === "AGENCY") {
        const agency = await tx.agency.create({
          data: {
            userId: createdUser.id,
            name: input.agencyName!,
            address: input.address!,
            city: input.city!,
            country: input.country!,
            licenseNumber: input.licenseNumber!
          }
        });

        return {
          ...createdUser,
          agency
        };
      }

      return {
        ...createdUser,
        agency: null
      };
    });

    const tokenPayload = {
      id: user.id,
      email: user.email,
      userType: user.userType as "RENTER" | "AGENCY" | "ADMIN"
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: makeRefreshExpiresAt()
      }
    });

    return { user: sanitizeUser(user as any), accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { agency: true }
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return null;

    if (user.isBanned) {
      throw new Error("User account is banned");
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      userType: user.userType as "RENTER" | "AGENCY" | "ADMIN",
      agencyId: user.agency?.id
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: makeRefreshExpiresAt()
      }
    });

    return {
      user: sanitizeUser(user as any),
      accessToken,
      refreshToken
    };
  },

  async refresh(refreshToken: string) {
    verifyRefreshToken(refreshToken);

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { agency: true } } }
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new Error("Invalid refresh token");
    }

    const payload = {
      id: stored.user.id,
      email: stored.user.email,
      userType: stored.user.userType as "RENTER" | "AGENCY" | "ADMIN",
      agencyId: stored.user.agency?.id
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token: refreshToken } }),
      prisma.refreshToken.create({
        data: {
          userId: stored.user.id,
          token: newRefreshToken,
          expiresAt: makeRefreshExpiresAt()
        }
      })
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout(token?: string) {
    if (!token) return;
    await prisma.refreshToken.deleteMany({ where: { token } });
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redis = getRedis();
    await redis.set(`password-otp:${email}`, otp, "EX", 600);
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const redis = getRedis();
    const storedOtp = await redis.get(`password-otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new Error("Invalid OTP");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid OTP");
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.refreshToken.deleteMany({ where: { userId: user.id } })
    ]);

    await redis.del(`password-otp:${email}`);
  }
};
