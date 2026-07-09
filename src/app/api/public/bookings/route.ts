import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json(
      { error: "Month parameter required (format: YYYY-MM)" },
      { status: 400 },
    );
  }

  const [year, monthNum] = month.split("-").map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      checkIn: { lte: endOfMonth },
      checkOut: { gte: startOfMonth },
    },
    orderBy: { checkIn: "asc" },
  });

  return NextResponse.json(bookings);
}
