import { prisma } from "@/lib/prisma";
import type { MonthlyRevenueItem } from "../types";

export async function getMonthlyRevenue(): Promise<MonthlyRevenueItem[]> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startOfYear, lt: startOfNextYear },
      status: { not: "CANCELLED" },
    },
    select: {
      totalPrice: true,
      createdAt: true,
    },
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i).toLocaleString("default", { month: "short" }),
    revenue: 0,
    count: 0,
  }));

  for (const booking of bookings) {
    const monthIndex = booking.createdAt.getMonth();
    months[monthIndex].revenue += Number(booking.totalPrice);
    months[monthIndex].count += 1;
  }

  return months;
}
