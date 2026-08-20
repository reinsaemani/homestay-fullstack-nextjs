import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/features/bookings/services/getBookings";
import { createBooking } from "@/features/bookings/services/createBooking";
import { createBookingSchema } from "@/features/bookings/schemas";
import type { BookingStatus } from "@/features/bookings/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusesParam = searchParams.get("statuses");
    const statuses = statusesParam
      ? (statusesParam.split(",").filter(Boolean) as BookingStatus[])
      : undefined;
    const bookings = await getBookings({
      page: Number(searchParams.get("page") || "1"),
      limit: Number(searchParams.get("limit") || "10"),
      statuses,
      search: searchParams.get("search") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const booking = await createBooking(parsed.data);
    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
