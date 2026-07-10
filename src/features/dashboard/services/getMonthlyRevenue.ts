import { prisma } from "@/lib/prisma";
import type { MonthlyRevenueItem } from "../types";

export async function getMonthlyRevenue(): Promise<MonthlyRevenueItem[]> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const [checkedOutBookings, cancelledBookings] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: "CHECKED_OUT",
        checkOut: { gte: startOfYear, lt: startOfNextYear },
      },
      select: { totalPrice: true, checkOut: true },
    }),
    prisma.booking.findMany({
      where: {
        status: "CANCELLED",
        updatedAt: { gte: startOfYear, lt: startOfNextYear },
      },
      select: { downPayment: true, updatedAt: true },
    }),
  ]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i).toLocaleString("default", { month: "short" }),
    revenue: 0,
    count: 0,
  }));

  for (const booking of checkedOutBookings) {
    const monthIndex = booking.checkOut.getMonth();
    months[monthIndex].revenue += Number(booking.totalPrice);
    months[monthIndex].count += 1;
  }

  for (const booking of cancelledBookings) {
    const monthIndex = booking.updatedAt.getMonth();
    months[monthIndex].revenue += Number(booking.downPayment);
  }

  return months;
}
