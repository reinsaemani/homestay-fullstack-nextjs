import { prisma } from "@/lib/prisma";
import type { DashboardMetrics } from "../types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  const [
    totalBookings,
    activeGuests,
    todayRevenueResult,
    pendingCheckIns,
    totalRevenueResult,
    piggyInResult,
    piggyOutResult,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.booking.count({ where: { status: "CHECKED_IN" } }),
    prisma.booking.aggregate({
      _sum: { downPayment: true },
      where: { createdAt: { gte: todayStart, lt: todayEnd } },
    }),
    prisma.booking.count({
      where: {
        status: "BOOKED",
        checkIn: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
    }),
    prisma.piggyBank.aggregate({
      _sum: { amount: true },
      where: { type: "IN" },
    }),
    prisma.piggyBank.aggregate({
      _sum: { amount: true },
      where: { type: "OUT" },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.totalPrice
    ? Number(totalRevenueResult._sum.totalPrice)
    : 0;

  const todayRevenue = todayRevenueResult._sum.downPayment
    ? Number(todayRevenueResult._sum.downPayment)
    : 0;

  const occupancyRate =
    totalBookings > 0
      ? Math.round((activeGuests / totalBookings) * 100)
      : 0;

  const piggyBankTotal =
    (Number(piggyInResult._sum.amount) || 0) -
    (Number(piggyOutResult._sum.amount) || 0);

  return {
    totalBookings,
    activeGuests,
    todayRevenue,
    pendingCheckIns,
    occupancyRate,
    totalRevenue,
    piggyBankTotal,
  };
}
