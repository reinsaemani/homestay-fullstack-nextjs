"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import DateDisplay from "@/components/common/DateDisplay";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import EmptyState from "@/components/common/EmptyState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import type { Booking } from "../types";
import { useLocale } from "@/context/LocaleContext";

interface BookingDataTableProps {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
}

export default function BookingDataTable({
  bookings,
  total,
  page,
  limit,
  loading,
  onPageChange,
  onView,
}: BookingDataTableProps) {
  const { t } = useLocale();
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <LoadingSkeleton rows={8} columns={6} />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <EmptyState
          title={t.bookings.noBookings}
          description={t.bookings.noBookingsDesc}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.guest}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.phone}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.city}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.checkIn}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.checkOut}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.totalPrice}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t.bookings.status}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  onClick={() => onView(String(booking.displayId))}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {booking.guestName}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {booking.phoneNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {(booking as Record<string, unknown>).city as string || "\u2014"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(booking.checkIn).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}{" "}
                    {new Date(booking.checkIn).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(booking.checkOut).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}{" "}
                    {new Date(booking.checkOut).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <CurrencyDisplay amount={booking.totalPrice} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <StatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-white/[0.05]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
