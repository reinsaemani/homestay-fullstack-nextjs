import { prisma } from "@/lib/prisma";

export interface IncomeReportItem {
  date: string;
  income: number;
}

export async function getIncomeReport(
  period: "weekly" | "monthly" | "yearly",
  value: string,
): Promise<{ items: IncomeReportItem[]; total: number }> {
  const year = Number(value.slice(0, 4));

  let startDate: Date;
  let endDate: Date;

  if (period === "yearly") {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year + 1, 0, 1);
  } else if (period === "monthly") {
    const month = Number(value.slice(5, 7)) - 1;
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 1);
  } else {
    const month = Number(value.slice(5, 7)) - 1;
    const weekNum = Number(value.slice(8));
    const weekStartDay = (weekNum - 1) * 7 + 1;
    startDate = new Date(year, month, weekStartDay);
    if (weekNum === 4) {
      endDate = new Date(year, month + 1, 1);
    } else {
      endDate = new Date(year, month, weekNum * 7 + 1);
    }
  }

  const [checkedOutBookings, cancelledBookings] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: "CHECKED_OUT",
        checkOut: { gte: startDate, lt: endDate },
      },
      orderBy: { checkOut: "asc" },
      select: { checkOut: true, totalPrice: true },
    }),
    prisma.booking.findMany({
      where: {
        status: "CANCELLED",
        updatedAt: { gte: startDate, lt: endDate },
      },
      orderBy: { updatedAt: "asc" },
      select: { updatedAt: true, downPayment: true },
    }),
  ]);

  let items: IncomeReportItem[] = [
    ...checkedOutBookings.map((b) => ({
      date: b.checkOut.toISOString().slice(0, 10),
      income: Number(b.totalPrice),
    })),
    ...cancelledBookings.map((b) => ({
      date: b.updatedAt.toISOString().slice(0, 10),
      income: Number(b.downPayment),
    })),
  ];

  items.sort((a, b) => a.date.localeCompare(b.date));

  if (period === "yearly") {
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
      date: `${year}-${String(i + 1).padStart(2, "0")}`,
      income: 0,
    }));
    for (const item of items) {
      const m = Number(item.date.slice(5, 7)) - 1;
      monthlyTotals[m].income += item.income;
    }
    const total = monthlyTotals.reduce((s, m) => s + m.income, 0);
    return { items: monthlyTotals, total };
  }

  const total = items.reduce((sum, item) => sum + item.income, 0);
  return { items, total };
}
