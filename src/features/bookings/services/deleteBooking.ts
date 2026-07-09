import { prisma } from "@/lib/prisma";

export async function deleteBooking(id: string) {
  return prisma.booking.delete({ where: { id } });
}
