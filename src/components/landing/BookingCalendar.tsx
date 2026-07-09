"use client";
import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";
import type { Booking } from "@/features/bookings/types";
import { useLocale } from "@/context/LocaleContext";

const STATUS_COLORS: Record<string, string> = {
  BOOKED: "blue",
  CHECKED_IN: "green",
  CHECKED_OUT: "gray",
  CANCELLED: "red",
};

export default function BookingCalendar() {
  const { t } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchBookings = useCallback(async (month: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/bookings?month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentMonth);
  }, [currentMonth, fetchBookings]);

  const events = bookings.map((booking) => ({
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
