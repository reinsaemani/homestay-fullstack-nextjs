import type { BookingStatus } from "../../../../generated/prisma/client";

export interface DashboardMetrics {
  totalBookings: number;
  activeGuests: number;
  todayRevenue: number;
  pendingCheckIns: number;
  occupancyRate: number;
  totalRevenue: number;
  piggyBankTotal: number;
}

export interface MonthlyRevenueItem {
  month: string;
  revenue: number;
  count: number;
}

export interface UpcomingBooking {
  id: string;
  guestName: string;
  city?: string | null;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: BookingStatus;
}

export interface CityDistributionItem {
  city: string;
  count: number;
}
