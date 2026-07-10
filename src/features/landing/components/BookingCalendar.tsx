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

  const handleDatesSet = (arg: { start: Date }) => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    const year = arg.start.getFullYear();
    const month = String(arg.start.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${year}-${month}`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          {t.landing.bookingCalendar}
        </h2>
        <div className="mb-4 flex flex-wrap gap-4">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        )}
        <div className={loading ? "opacity-40 pointer-events-none" : ""}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
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
