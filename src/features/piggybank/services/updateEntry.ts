import { prisma } from "@/lib/prisma";
import type { PiggyBankFormData } from "../types";

export async function updateEntry(
  id: string,
  data: PiggyBankFormData,
) {
  return prisma.piggyBank.update({
    where: { id },
    data: {
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date + "T00:00:00.000Z"),
    },
  });
}
