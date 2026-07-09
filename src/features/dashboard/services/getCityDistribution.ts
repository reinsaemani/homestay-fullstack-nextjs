import { prisma } from "@/lib/prisma";
import type { CityDistributionItem } from "../types";

export async function getCityDistribution(): Promise<CityDistributionItem[]> {
  const results = await prisma.booking.groupBy({
    by: ["city"],
    _count: { city: true },
    orderBy: { _count: { city: "desc" } },
  });

  return results
    .filter((r) => r.city !== null)
    .map((r) => ({
      city: r.city!,
      count: r._count.city,
    }));
}
