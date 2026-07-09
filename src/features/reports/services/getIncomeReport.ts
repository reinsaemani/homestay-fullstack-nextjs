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
    const week = Number(value.slice(-2));
    const janFirst = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    startDate = new Date(janFirst.getTime() + daysOffset * 86400000);
    endDate = new Date(startDate.getTime() + 7 * 86400000);
  }

  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startDate, lt: endDate },
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "asc" },
    select: {
      createdAt: true,
      totalPrice: true,
    },
  });

  const items: IncomeReportItem[] = bookings.map((b) => ({
    date: b.createdAt.toISOString().slice(0, 10),
    income: Number(b.totalPrice),
  }));

  const total = items.reduce((sum, item) => sum + item.income, 0);

  return { items, total };
}
