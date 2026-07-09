import { prisma } from "@/lib/prisma";
import type { UpcomingBooking } from "../types";

export async function getUpcomingBookings(): Promise<UpcomingBooking[]> {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 86400000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["BOOKED", "CHECKED_IN"] },
      checkIn: { gte: now, lte: nextWeek },
    },
    orderBy: { checkIn: "asc" },
    take: 10,
  });

  return bookings.map((b) => ({
    ...b,
    totalPrice: b.totalPrice.toNumber(),
    pricePerNight: b.pricePerNight.toNumber(),
    downPayment: b.downPayment.toNumber(),
    city: b.city || null,
  }));
}
