"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BookingForm from "@/features/bookings/components/BookingForm";
import type { BookingFormData } from "@/features/bookings/types";
import { useLocale } from "@/context/LocaleContext";
import { toast } from "sonner";

interface EditBookingFormProps {
  displayId: string;
  initialData: BookingFormData;
}

export default function EditBookingForm({
  displayId,
  initialData,
}: EditBookingFormProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${displayId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      toast.success(t.editBooking.updated);
      router.push(`/bookings/${displayId}`);
      router.refresh();
    } catch {
      toast.error(t.editBooking.errorOccurred);
      setLoading(false);
    }
  };

  return (
    <BookingForm
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
