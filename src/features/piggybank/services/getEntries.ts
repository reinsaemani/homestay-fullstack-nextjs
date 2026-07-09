import { prisma } from "@/lib/prisma";
import type { PiggyBankListResponse } from "../types";

export async function getEntries(): Promise<PiggyBankListResponse> {
  const [entries, total] = await Promise.all([
    prisma.piggyBank.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.piggyBank.count(),
  ]);

  return { entries, total };
}
