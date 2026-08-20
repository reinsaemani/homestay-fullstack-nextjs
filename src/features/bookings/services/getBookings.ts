import { prisma } from "@/lib/prisma";
import type { BookingFilters, BookingListResponse } from "../types";
import { Prisma } from "../../../../generated/prisma/client";

export async function getBookings(
  filters: BookingFilters,
): Promise<BookingListResponse> {
  const where: Prisma.BookingWhereInput = {};

  if (filters.statuses && filters.statuses.length > 0) {
    where.status = { in: filters.statuses };
  }

  if (filters.search) {
    where.guestName = { contains: filters.search, mode: "insensitive" };
  }

  if (filters.dateFrom || filters.dateTo) {
    where.checkIn = {};
    if (filters.dateFrom) where.checkIn.gte = new Date(filters.dateFrom);
    if (filters.dateTo) where.checkIn.lte = new Date(filters.dateTo);
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { checkIn: "asc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total, page: filters.page, limit: filters.limit };
}
