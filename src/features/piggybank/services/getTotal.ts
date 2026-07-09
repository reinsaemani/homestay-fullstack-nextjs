import { prisma } from "@/lib/prisma";

export async function getPiggyBankTotal(): Promise<number> {
  const result = await prisma.piggyBank.aggregate({
    _sum: { amount: true },
    where: { type: "IN" },
  });

  const inAmount = Number(result._sum.amount) || 0;

  const outResult = await prisma.piggyBank.aggregate({
    _sum: { amount: true },
    where: { type: "OUT" },
  });

  const outAmount = Number(outResult._sum.amount) || 0;

  return inAmount - outAmount;
}
