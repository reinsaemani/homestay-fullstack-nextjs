"use client";
import ComponentCard from "@/components/common/ComponentCard";
import StatusBadge from "@/components/common/StatusBadge";
import DateDisplay from "@/components/common/DateDisplay";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import type { Booking } from "../types";
import { useLocale } from "@/context/LocaleContext";

interface SerializedBooking extends Omit<Booking, "pricePerNight" | "totalPrice" | "downPayment"> {
  pricePerNight: number;
  totalPrice: number;
  downPayment: number;
}

interface BookingDetailCardProps {
  booking: SerializedBooking;
}

export default function BookingDetailCard({
  booking,
}: BookingDetailCardProps) {
  const { t } = useLocale();
  const fields = [
    { label: t.bookingDetail.guestName, value: booking.guestName },
    { label: t.bookingDetail.phoneNumber, value: booking.phoneNumber },
    { label: t.bookingDetail.city, value: booking.city || "—" },
    {
      label: t.bookingDetail.checkIn,
      value: <DateDisplay date={booking.checkIn} options={{ year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }} />,
    },
    {
      label: t.bookingDetail.checkOut,
      value: <DateDisplay date={booking.checkOut} options={{ year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }} />,
    },
    {
      label: t.bookingDetail.pricePerNight,
      value: <CurrencyDisplay amount={booking.pricePerNight} />,
    },
    {
      label: t.bookingDetail.totalPrice,
      value: <CurrencyDisplay amount={booking.totalPrice} />,
    },
    {
      label: t.bookingDetail.downPayment,
      value: <CurrencyDisplay amount={booking.downPayment} />,
    },
    {
      label: t.bookingDetail.remaining,
      value: <CurrencyDisplay amount={Number(booking.totalPrice) - Number(booking.downPayment)} />,
    },
    { label: t.bookingDetail.status, value: <StatusBadge status={booking.status} /> },
    { label: t.bookingDetail.note, value: booking.note || "—" },
    {
      label: t.bookingDetail.created,
      value: <DateDisplay date={booking.createdAt} options={{ year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }} />,
    },
  ];

  return (
    <ComponentCard title={t.bookingDetail.title}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              {field.label}
            </p>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
}
