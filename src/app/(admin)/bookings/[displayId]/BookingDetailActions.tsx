"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BookingActions from "@/features/bookings/components/BookingActions";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { BookingStatus } from "@/features/bookings/types";
import { useLocale } from "@/context/LocaleContext";
import { toast } from "sonner";

function formatTimeInput(dateStr?: string): string {
  if (!dateStr) return "10:00";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "10:00";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function BookingDetailActions({
  bookingId,
  displayId,
  status: initialStatus,
}: {
  bookingId: string;
  displayId: number;
  status: BookingStatus;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BookingStatus | null>(null);
  const [time, setTime] = useState("10:00");
  const [error, setError] = useState("");

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setConfirmAction(newStatus);
    setTime(newStatus === "CHECKED_OUT" ? formatTimeInput(undefined) : "10:00");
    setError("");
  };

  const confirmStatusChange = async () => {
    if (!confirmAction) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${displayId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: confirmAction, time }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t.bookingDetail.failedUpdate);
      }

      setConfirmAction(null);
      toast.success(t.bookingDetail.statusUpdated);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.bookingDetail.errorOccurred);
      toast.error(t.bookingDetail.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const needsTime = confirmAction === "CHECKED_IN" || confirmAction === "CHECKED_OUT";

  return (
    <>
      {error && (
        <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
          {error}
        </div>
      )}
      <BookingActions
        booking={{ id: bookingId, status: initialStatus }}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmStatusChange}
        title={confirmAction === "CANCELLED" ? t.bookingDetail.confirmCancellation : t.bookingDetail.confirmStatusChange}
        message={
          confirmAction === "CANCELLED"
            ? t.bookingDetail.cancelConfirmMessage
            : t.bookingDetail.statusChangeConfirmMessage.replace("{status}", t.status[confirmAction as keyof typeof t.status] ?? confirmAction ?? "")
        }
        confirmText={
          confirmAction === "CANCELLED" ? t.bookingDetail.cancelBooking : t.bookingDetail.confirm
        }
        cancelText={t.common.cancel}
        variant={confirmAction === "CANCELLED" ? "danger" : "primary"}
        loading={loading}
      >
        {needsTime && (
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Jam
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
            />
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}
