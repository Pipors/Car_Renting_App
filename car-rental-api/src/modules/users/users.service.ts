import { prisma } from "../../config/database";
import { getRedis } from "../../config/redis";

export const usersService = {
  async getMe(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        agency: true
      }
    });
  },

  async updateMe(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;

    const phoneChanged = typeof data.phone !== "undefined" && data.phone !== existing.phone;

    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        ...(phoneChanged ? { phoneVerified: false } : {})
      },
      include: {
        agency: true
      }
    });
  },

  async sendPhoneOtp(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.phone) {
      throw new Error("User phone is not set");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await getRedis().set(`phone-otp:${user.id}`, otp, "EX", 300);
  },

  async verifyPhone(userId: string, otp: string) {
    const redis = getRedis();
    const key = `phone-otp:${userId}`;
    const storedOtp = await redis.get(key);

    if (!storedOtp || storedOtp !== otp) {
      throw new Error("Invalid phone OTP");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { phoneVerified: true }
    });

    await redis.del(key);
  }
};
