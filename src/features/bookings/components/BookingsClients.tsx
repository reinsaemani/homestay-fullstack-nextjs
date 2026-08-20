"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import BookingDataTable from "@/features/bookings/components/BookingDataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { PlusIcon } from "@/icons";
import { useLocale } from "@/context/LocaleContext";
import { STATUS_COLORS } from "@/features/bookings/constants";
import type { BookingStatus } from "@/features/bookings/types";

const ALL_STATUSES: BookingStatus[] = ["BOOKED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"];

export default function BookingsClient() {
  const { t } = useLocale();
  const router = useRouter();
  const { bookings, total, loading, filters, updateFilters } = useBookings({
    page: 1,
    limit: 10,
    statuses: ["BOOKED"],
  });

  const [search, setSearch] = useState(filters.search || "");
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || "");
  const [dateTo, setDateTo] = useState(filters.dateTo || "");
  const [selectedStatuses, setSelectedStatuses] = useState<BookingStatus[]>(
    filters.statuses || ["BOOKED"]
  );
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStatus = useCallback((status: BookingStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }, []);

  const applyFilters = useCallback(() => {
    updateFilters({
      search: search || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      page: 1,
    });
  }, [search, dateFrom, dateTo, selectedStatuses, updateFilters]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSelectedStatuses(["BOOKED"]);
    updateFilters({
      search: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      statuses: ["BOOKED"],
      page: 1,
    });
  }, [updateFilters]);

  const hasFilters =
    search ||
    dateFrom ||
    dateTo ||
    selectedStatuses.length !== 1 ||
    selectedStatuses[0] !== "BOOKED";

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
        <div className="relative" ref={dropdownRef}>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {t.bookings.status}
          </label>
          <button
            type="button"
            onClick={() => setStatusDropdownOpen((prev) => !prev)}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
          >
            <span className="truncate max-w-[160px]">
              {selectedStatuses.length === ALL_STATUSES.length
                ? t.bookings.allStatuses
                : selectedStatuses.length === 0
                  ? t.bookings.selectStatus
                  : selectedStatuses.map((s) => (t.status as Record<string, string>)[s] || s).join(", ")}
            </span>
            <svg
              className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {statusDropdownOpen && (
            <div className="absolute z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {ALL_STATUSES.map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Badge
                    color={STATUS_COLORS[status]}
                    size="sm"
                  >
                    {(t.status as Record<string, string>)[status] || status}
                  </Badge>
                </label>
              ))}
            </div>
          )}
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
