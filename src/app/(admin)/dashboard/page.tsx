import type { Metadata } from "next";
import React from "react";
import TodayMetricsCards from "@/features/dashboard/components/TodayMetricsCards";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import OccupancyRate from "@/features/dashboard/components/OccupancyRate";
import CityDistribution from "@/features/dashboard/components/CityDistribution";
import BookingTrendChart from "@/features/dashboard/components/BookingTrendChart";
import UpcomingBookings from "@/features/dashboard/components/UpcomingBookings";
import { getDashboardMetrics } from "@/features/dashboard/services/getDashboardMetrics";
import { getMonthlyRevenue } from "@/features/dashboard/services/getMonthlyRevenue";
import { getBookingTrends } from "@/features/dashboard/services/getBookingTrends";
import { getUpcomingBookings } from "@/features/dashboard/services/getUpcomingBookings";
import { getCityDistribution } from "@/features/dashboard/services/getCityDistribution";
import { getDictionary, hasLocale, defaultLocale } from "@/dictionaries";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.dashboard.title,
    description: dict.dashboard.description,
  };
}

export default async function AdminDashboard() {
  const [metrics, revenue, trends, upcoming, cityDist] = await Promise.all([
    getDashboardMetrics(),
    getMonthlyRevenue(),
    getBookingTrends(),
    getUpcomingBookings(),
    getCityDistribution(),
  ]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TodayMetricsCards metrics={metrics} />
        <RevenueChart data={revenue} />
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-5">
        <OccupancyRate rate={metrics.occupancyRate} />
        <CityDistribution data={cityDist} />
      </div>

      <div className="col-span-12">
        <BookingTrendChart data={trends} />
      </div>

      <div className="col-span-12">
        <UpcomingBookings bookings={upcoming} />
      </div>
    </div>
  );
}
