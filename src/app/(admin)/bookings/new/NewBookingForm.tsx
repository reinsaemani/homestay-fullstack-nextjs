"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BookingForm from "@/features/bookings/components/BookingForm";
import type { BookingFormData } from "@/features/bookings/types";

export default function NewBookingForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create booking");

      router.push("/bookings");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return <BookingForm onSubmit={handleSubmit} loading={loading} />;
}
