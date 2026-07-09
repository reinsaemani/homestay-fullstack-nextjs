"use client";
import { useLocale } from "@/context/LocaleContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/common/StatusBadge";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import EmptyState from "@/components/common/EmptyState";
import type { UpcomingBooking } from "../types";

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

interface UpcomingBookingsProps {
  bookings: UpcomingBooking[];
}

export default function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  const { t } = useLocale();
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          {t.dashboard.upcomingCheckIns}
        </h3>
        <EmptyState
          title={t.dashboard.noUpcoming}
          description={t.dashboard.noUpcomingDesc}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        {t.dashboard.upcomingCheckIns}
      </h3>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{t.dashboard.guest}</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{t.dashboard.city}</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{t.dashboard.checkIn}</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{t.dashboard.checkOut}</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{t.dashboard.total}</TableCell>
                <TableCell isHeader className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{t.dashboard.status}</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableCell className="px-4 py-3 text-center font-medium text-gray-800 dark:text-white/90">
                    {booking.guestName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    {booking.city || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    {new Date(booking.checkIn).toLocaleDateString("id-ID")} {formatTime(booking.checkIn)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    {new Date(booking.checkOut).toLocaleDateString("id-ID")} {formatTime(booking.checkOut)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    <CurrencyDisplay amount={booking.totalPrice} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <StatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
