import { prisma } from "@/lib/prisma";
import type { BookingFormData } from "../types";
import type { Prisma } from "../../../../generated/prisma/client";

export async function updateBooking(id: string, data: Partial<BookingFormData>) {
  const updateData: Prisma.BookingUpdateInput = {};

  if (data.guestName !== undefined) updateData.guestName = data.guestName;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.checkIn !== undefined) updateData.checkIn = new Date(data.checkIn);
  if (data.checkOut !== undefined) updateData.checkOut = new Date(data.checkOut);
  if (data.pricePerNight !== undefined) updateData.pricePerNight = data.pricePerNight;
  if (data.totalPrice !== undefined) updateData.totalPrice = data.totalPrice;
  if (data.downPayment !== undefined) updateData.downPayment = data.downPayment;
  if (data.note !== undefined) updateData.note = data.note;

  return prisma.booking.update({
    where: { id },
    data: updateData,
  });
}
