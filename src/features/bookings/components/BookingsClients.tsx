"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import BookingDataTable from "@/features/bookings/components/BookingDataTable";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useLocale } from "@/context/LocaleContext";

export default function BookingsClient() {
  const { t } = useLocale();
  const router = useRouter();
  const { bookings, total, loading, filters, updateFilters } = useBookings({
    page: 1,
    limit: 10,
  });

  const [search, setSearch] = useState(filters.search || "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");

  const applyFilters = useCallback(() => {
    updateFilters({
      search: search || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page: 1,
    });
  }, [search, dateFrom, dateTo, updateFilters]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    updateFilters({ search: undefined, dateFrom: undefined, dateTo: undefined, page: 1 });
  }, [updateFilters]);

  const hasFilters = search || dateFrom || dateTo;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {t.bookings.searchGuest}
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder={t.bookings.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
          />
        </div>
        <div className="w-[180px]">
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {t.bookings.checkInFrom}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
          />
        </div>
        <div className="w-[180px]">
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {t.bookings.checkInTo}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={applyFilters}>
            {t.bookings.filter}
          </Button>
          {hasFilters && (
            <Button size="sm" variant="outline" onClick={clearFilters}>
              {t.bookings.clearFilter}
            </Button>
          )}
        </div>
        <div className="ml-auto flex items-center">
          <Button
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => router.push("/bookings/new")}
          >
            {t.bookings.newBooking}
          </Button>
        </div>
      </div>
      <BookingDataTable
        bookings={bookings}
        total={total}
        page={filters.page}
        limit={filters.limit}
        loading={loading}
        onPageChange={(page) => updateFilters({ page })}
        onView={(id) => router.push(`/bookings/${id}`)}
      />
    </div>
  );
}
