import { prisma } from "@/lib/prisma";

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id } });
}

export async function getBookingByDisplayId(displayId: number) {
  return prisma.booking.findUnique({ where: { displayId } });
}
