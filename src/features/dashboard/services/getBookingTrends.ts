import { prisma } from "@/lib/prisma";

export async function getBookingTrends() {
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startOfYear, lt: startOfNextYear },
    },
    select: { createdAt: true },
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i).toLocaleString("default", { month: "short" }),
    bookings: 0,
  }));

  for (const booking of bookings) {
    months[booking.createdAt.getMonth()].bookings += 1;
  }

  return months;
}
