"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Booking, BookingFilters } from "../types";

export const useBookings = (initialFilters: BookingFilters) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>(initialFilters);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(filters.page),
          limit: String(filters.limit),
        });
        if (filters.status) params.set("status", filters.status);
        if (filters.search) params.set("search", filters.search);
        if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.set("dateTo", filters.dateTo);

        const res = await fetch(`/api/bookings?${params}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        if (mounted.current) {
          setBookings(data.bookings);
          setTotal(data.total);
        }
      } catch (err) {
        if (mounted.current) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted.current = false;
    };
  }, [filters.page, filters.limit, filters.status, filters.search, filters.dateFrom, filters.dateTo]);

  const updateFilters = useCallback(
    (partial: Partial<BookingFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const refetch = useCallback(() => {
    setFilters((prev) => ({ ...prev }));
  }, []);

  return { bookings, total, loading, error, filters, updateFilters, refetch };
};
