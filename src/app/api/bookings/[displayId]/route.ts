import { NextRequest, NextResponse } from "next/server";
import { getBookingByDisplayId } from "@/features/bookings/services/getBookingById";
import { updateBooking } from "@/features/bookings/services/updateBooking";
import { deleteBooking } from "@/features/bookings/services/deleteBooking";
import { updateBookingStatus } from "@/features/bookings/services/updateBookingStatus";
import {
  updateBookingSchema,
  updateBookingStatusSchema,
} from "@/features/bookings/schemas";

async function resolveBooking(displayId: number) {
  const booking = await getBookingByDisplayId(displayId);
  if (!booking) return null;
  return booking;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ displayId: string }> },
) {
  try {
    const { displayId } = await params;
    const booking = await getBookingByDisplayId(Number(displayId));

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ displayId: string }> },
) {
  try {
    const { displayId } = await params;
    const booking = await resolveBooking(Number(displayId));
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await request.json();

    if (body.status) {
      const parsed = updateBookingStatusSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid status", details: parsed.error.flatten() },
          { status: 400 },
        );
      }
      const updated = await updateBookingStatus(booking.id, parsed.data.status, parsed.data.time);
      return NextResponse.json(updated);
    }

    const parsed = updateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await updateBooking(booking.id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update booking";
    const status = message === "Booking not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ displayId: string }> },
) {
  try {
    const { displayId } = await params;
    const booking = await resolveBooking(Number(displayId));
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    await deleteBooking(booking.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
