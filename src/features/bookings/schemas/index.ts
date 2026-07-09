import { z } from "zod";

export const createBookingSchema = z
  .object({
    guestName: z.string().min(1, "Guest name is required"),
    phoneNumber: z.string().min(8, "Valid phone number required"),
    city: z.string().optional(),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    pricePerNight: z.number().positive("Price must be positive"),
    totalPrice: z.number().positive("Total price must be positive"),
    downPayment: z.number().min(0, "Down payment cannot be negative"),
    note: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.checkOut) > new Date(data.checkIn),
    { message: "Check-out must be after check-in", path: ["checkOut"] },
  );

export const updateBookingSchema = z.object({
  guestName: z.string().min(1).optional(),
  phoneNumber: z.string().min(8).optional(),
  city: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  pricePerNight: z.number().positive().optional(),
  totalPrice: z.number().positive().optional(),
  downPayment: z.number().min(0).optional(),
  note: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CHECKED_IN", "CHECKED_OUT", "CANCELLED"]),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format").optional(),
});
