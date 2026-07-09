"use client";
import Button from "@/components/ui/button/Button";
import type { BookingStatus } from "../types";
import { useLocale } from "@/context/LocaleContext";

interface BookingActionsProps {
  booking: { id: string; status: BookingStatus };
  onStatusChange: (id: string, status: BookingStatus) => void;
  loading?: boolean;
}

const getActions = (t: any): Record<
  BookingStatus,
  { next: BookingStatus; label: string; color: "primary" | "outline" }[]
> => ({
  BOOKED: [
    { next: "CHECKED_IN", label: t.bookingDetail.checkIn, color: "primary" },
    { next: "CANCELLED", label: t.bookingDetail.cancel, color: "outline" },
  ],
  CHECKED_IN: [
    { next: "CHECKED_OUT", label: t.bookingDetail.checkOut, color: "primary" },
    { next: "CANCELLED", label: t.bookingDetail.cancel, color: "outline" },
  ],
  CHECKED_OUT: [],
  CANCELLED: [],
});

export default function BookingActions({
  booking,
  onStatusChange,
  loading,
}: BookingActionsProps) {
  const { t } = useLocale();
  const actions = getActions(t)[booking.status];

  if (actions.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => (
        <Button
          key={action.next}
          size="sm"
          variant={action.color}
          onClick={() => onStatusChange(booking.id, action.next)}
          disabled={loading}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
