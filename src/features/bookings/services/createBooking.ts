import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import type { BookingFormData } from "../types";

export async function createBooking(data: BookingFormData) {
  return prisma.booking.create({
    data: {
      id: randomUUID(),
      guestName: data.guestName,
      phoneNumber: data.phoneNumber,
      city: data.city || null,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      pricePerNight: data.pricePerNight,
      totalPrice: data.totalPrice,
      downPayment: data.downPayment,
      note: data.note || null,
    },
  });
}
