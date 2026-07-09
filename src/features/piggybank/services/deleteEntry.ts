import { prisma } from "@/lib/prisma";

export async function deleteEntry(id: string) {
  return prisma.piggyBank.delete({ where: { id } });
}
