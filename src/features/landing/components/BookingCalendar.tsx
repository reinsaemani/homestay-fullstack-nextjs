"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";
import type { Booking } from "@/features/bookings/types";
import { useLocale } from "@/context/LocaleContext";

const STATUS_COLORS: Record<string, string> = {
  BOOKED: "blue",
  CHECKED_IN: "green",
  CANCELLED: "red",
};

const LEGEND_ITEMS = [
  { label: "Pesan", color: "blue" },
  { label: "Check In", color: "green" },
  { label: "Batal", color: "red" },
];

export default function BookingCalendar() {
  const { t } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [calendarKey, setCalendarKey] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const initialRef = useRef(true);

  const fetchBookings = useCallback(async (month: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(`/api/public/bookings?month=${month}`, {
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (!controller.signal.aborted) {
          setBookings(data);
        }
      }
    } catch {
      // silent fail
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentMonth);
    return () => abortRef.current?.abort();
  }, [currentMonth, fetchBookings]);

  const events = bookings
    .filter((booking) => booking.status !== "CHECKED_OUT")
    .map((booking) => ({
      id: booking.id,
      title: booking.guestName,
      start: booking.checkIn,
      end: booking.checkOut,
      backgroundColor: STATUS_COLORS[booking.status] || "blue",
      borderColor: STATUS_COLORS[booking.status] || "blue",
      textColor: "#fff",
      extendedProps: {
        status: booking.status,
      },
    }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDatesSet = (arg: any) => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    // Use view.currentStart which is the actual start of the month view,
    // NOT arg.start which is the first day of the calendar grid (includes prev month padding)
    const viewStart = arg.view?.currentStart ?? arg.start;
    const year = viewStart.getFullYear();
    const month = String(viewStart.getMonth() + 1).padStart(2, "0");
    const newMonth = `${year}-${month}`;
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
      setCalendarKey((k) => k + 1);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90 sm:mb-4 sm:text-xl">
          {t.landing.bookingCalendar}
        </h2>
        <div className="mb-3 flex flex-wrap gap-3 sm:mb-4 sm:gap-4">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 sm:gap-2 sm:text-sm">
              <span className="inline-block h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        )}
        <div className={`calendar-container ${loading ? "opacity-40 pointer-events-none" : ""}`}>
          <FullCalendar
            key={calendarKey}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate={`${currentMonth}-01`}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            dayMaxEvents={2}
            events={events}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}

const renderEventContent = (eventInfo: EventContentArg) => {
  return (
    <div className="flex items-center gap-1 overflow-hidden rounded px-1 py-0.5 text-xs">
      <span className="font-medium">{eventInfo.event.title}</span>
    </div>
  );
};
