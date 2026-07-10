import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "../../../../generated/prisma/client";

const VALID_TRANSITIONS: Record<string, string[]> = {
  BOOKED: ["CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["CHECKED_OUT", "CANCELLED"],
  CHECKED_OUT: [],
  CANCELLED: [],
};

export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
  time?: string,
) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error("Booking not found");

  const allowed = VALID_TRANSITIONS[booking.status];
  if (!allowed?.includes(newStatus)) {
    throw new Error(
      `Cannot transition from ${booking.status} to ${newStatus}`,
    );
  }

  const data: Record<string, unknown> = { status: newStatus };

  if (time) {
    const [h, m] = time.split(":").map(Number);

    if (newStatus === "CHECKED_IN") {
      const checkIn = new Date(booking.checkIn);
      checkIn.setHours(h, m, 0, 0);
      data.checkIn = checkIn;
    }

    if (newStatus === "CHECKED_OUT") {
      const checkOut = new Date(booking.checkOut);
      checkOut.setHours(h, m, 0, 0);
      data.checkOut = checkOut;
      data.downPayment = booking.totalPrice;
    }
  }

  return prisma.booking.update({
    where: { id },
    data,
  });
}
