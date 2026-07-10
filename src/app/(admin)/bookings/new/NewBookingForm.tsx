"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BookingForm from "@/features/bookings/components/BookingForm";
import type { BookingFormData } from "@/features/bookings/types";
import { useLocale } from "@/context/LocaleContext";
import { toast } from "sonner";

export default function NewBookingForm() {
  const { t } = useLocale();
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

      toast.success(t.newBooking.created);
      router.push("/bookings");
      router.refresh();
    } catch {
      toast.error(t.newBooking.errorOccurred);
      setLoading(false);
    }
  };

  return <BookingForm onSubmit={handleSubmit} loading={loading} />;
}
