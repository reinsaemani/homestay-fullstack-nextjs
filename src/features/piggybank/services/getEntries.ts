import { prisma } from "@/lib/prisma";
import type { PiggyBankListResponse } from "../types";

export async function getEntries(): Promise<PiggyBankListResponse> {
  const [entries, total, inResult, outResult] = await Promise.all([
    prisma.piggyBank.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    prisma.piggyBank.count(),
    prisma.piggyBank.aggregate({
      _sum: { amount: true },
      where: { type: "IN" },
    }),
    prisma.piggyBank.aggregate({
      _sum: { amount: true },
      where: { type: "OUT" },
    }),
  ]);

  const inAmount = Number(inResult._sum.amount) || 0;
  const outAmount = Number(outResult._sum.amount) || 0;
  const balance = inAmount - outAmount;

  return { entries, total, balance };
}
