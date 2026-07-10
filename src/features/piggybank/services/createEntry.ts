import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import type { PiggyBankFormData } from "../types";

export async function createEntry(data: PiggyBankFormData) {
  return prisma.piggyBank.create({
    data: {
      id: randomUUID(),
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date + "T00:00:00.000Z"),
    },
  });
}
