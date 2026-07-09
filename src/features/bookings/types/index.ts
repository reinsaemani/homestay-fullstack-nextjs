import type { Booking, BookingStatus } from "../../../../generated/prisma/client";

export type { Booking, BookingStatus };

export interface BookingFormData {
  guestName: string;
  phoneNumber: string;
  city?: string;
  checkIn: string;
  checkOut: string;
  pricePerNight: number;
  totalPrice: number;
  downPayment: number;
  note?: string;
}

export interface BookingFilters {
  page: number;
  limit: number;
  status?: BookingStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

export type StatusTransition =
  | { from: "BOOKED"; to: "CHECKED_IN" | "CANCELLED" }
  | { from: "CHECKED_IN"; to: "CHECKED_OUT" | "CANCELLED" };
