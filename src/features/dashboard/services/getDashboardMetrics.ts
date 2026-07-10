import { prisma } from "@/lib/prisma";
import type { DashboardMetrics } from "../types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  const [
    totalBookings,
    activeGuests,
    todayCheckedOutRev,
    todayCancelledDP,
    pendingCheckIns,
    totalRevenueResult,
    piggyInResult,
    piggyOutResult,
    activeToday,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.booking.count({ where: { status: "CHECKED_IN" } }),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        status: "CHECKED_OUT",
        checkOut: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.booking.aggregate({
      _sum: { downPayment: true },
      where: {
        status: "CANCELLED",
        updatedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.booking.count({
      where: {
        status: "BOOKED",
        checkIn: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.booking.aggregate({
      _sum: { downPayment: true },
      where: { status: "CANCELLED" },
    }),
    prisma.piggyBank.aggregate({
      _sum: { amount: true },
      where: { type: "IN" },
    }),
    prisma.piggyBank.aggregate({
      _sum: { amount: true },
      where: { type: "OUT" },
    }),
    prisma.booking.count({
      where: {
        checkIn: { lte: todayEnd },
        checkOut: { gte: todayStart },
        status: { notIn: ["CANCELLED", "CHECKED_OUT"] },
      },
    }),
  ]);

  const todayCheckedOut = Number(todayCheckedOutRev._sum.totalPrice) || 0;
  const todayCancelled = Number(todayCancelledDP._sum.downPayment) || 0;
  const todayRevenue = todayCheckedOut + todayCancelled;

  const totalCancelledDP = Number(totalRevenueResult._sum.downPayment) || 0;

  const checkedOutTotal = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { status: "CHECKED_OUT" },
  });
  const totalRevenue = (Number(checkedOutTotal._sum.totalPrice) || 0) + totalCancelledDP;

  const occupancyRate =
    activeToday > 0
      ? Math.round((activeGuests / activeToday) * 100)
      : activeGuests > 0 ? 100 : 0;

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
