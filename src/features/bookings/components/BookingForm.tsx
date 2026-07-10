"use client";
import React, { useState, useEffect, useCallback } from "react";
import InputField from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import CitySelect from "@/features/common/components/CitySelect";
import type { BookingFormData } from "../types";
import { useLocale } from "@/context/LocaleContext";

interface BookingFormProps {
  initialData?: BookingFormData;
  onSubmit: (data: BookingFormData) => Promise<void>;
  loading?: boolean;
}

function parseIdr(value: string): number {
  return Number(value.replace(/\./g, ""));
}

function formatIdr(value: number): string {
  if (isNaN(value)) return "0";
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn + "T00:00:00.000Z");
  const end = new Date(checkOut + "T00:00:00.000Z");
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function BookingForm({
  initialData,
  onSubmit,
  loading,
}: BookingFormProps) {
  const { t } = useLocale();
  const [error, setError] = useState("");
  const [city, setCity] = useState(initialData?.city || "");

  const [pricePerNight, setPricePerNight] = useState(initialData?.pricePerNight ?? 1_000_000);
  const [checkIn, setCheckIn] = useState(initialData?.checkIn || toLocalDateString(new Date()));
  const [checkOut, setCheckOut] = useState(initialData?.checkOut || "");
  const [totalPrice, setTotalPrice] = useState(initialData?.totalPrice ?? 0);
  const [downPayment, setDownPayment] = useState(initialData?.downPayment ?? 0);
  const [priceDisplay, setPriceDisplay] = useState(formatIdr(initialData?.pricePerNight ?? 1_000_000));

  useEffect(() => {
    const nights = calcNights(checkIn, checkOut);
    if (nights > 0) {
      setTotalPrice(nights * pricePerNight);
    } else if (checkIn && checkOut) {
      setTotalPrice(pricePerNight);
    }
  }, [checkIn, checkOut, pricePerNight]);

  const remaining = totalPrice - downPayment;

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = raw ? Number(raw) : 0;
    setPricePerNight(num);
    setPriceDisplay(formatIdr(num));
  }, []);

  const handleDownPaymentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = raw ? Number(raw) : 0;
    setDownPayment(num);
  }, []);

  const handleCheckInChange = useCallback((dates: Date[]) => {
    if (dates[0]) {
      const d = dates[0];
      setCheckIn(toLocalDateString(d));
    }
  }, []);

  const handleCheckOutChange = useCallback((dates: Date[]) => {
    if (dates[0]) {
      const d = dates[0];
      setCheckOut(toLocalDateString(d));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const nights = calcNights(checkIn, checkOut);

    if (checkOut && new Date(checkOut + "T00:00:00.000Z") <= new Date(checkIn + "T00:00:00.000Z")) {
      setError(t.newBooking.checkOutAfterCheckIn);
      return;
    }

    const data: BookingFormData = {
      guestName: formData.get("guestName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      city: city || undefined,
      checkIn: new Date(checkIn + "T00:00:00.000Z").toISOString(),
      checkOut: checkOut ? new Date(checkOut + "T00:00:00.000Z").toISOString() : new Date(checkIn + "T00:00:00.000Z").toISOString(),
      pricePerNight,
      totalPrice,
      downPayment,
      note: (formData.get("note") as string) || undefined,
    };

    await onSubmit(data);
  };

  const nights = calcNights(checkIn, checkOut);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="guestName">
              {t.newBooking.guestName} <span className="text-error-500">*</span>
            </Label>
            <InputField
              id="guestName"
              name="guestName"
              type="text"
              placeholder={t.newBooking.guestNamePlaceholder}
              defaultValue={initialData?.guestName}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">
              {t.newBooking.phoneNumber} <span className="text-error-500">*</span>
            </Label>
            <InputField
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder={t.newBooking.phoneNumberPlaceholder}
              defaultValue={initialData?.phoneNumber}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">
              {t.newBooking.city}
            </Label>
            <CitySelect
              value={initialData?.city || ""}
              onChange={(val) => setCity(val)}
              placeholder={t.newBooking.cityPlaceholder}
            />
            <input type="hidden" name="city" value={city} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <DatePicker
              id="checkIn"
              label={t.newBooking.checkIn + " *"}
              placeholder={t.newBooking.checkInPlaceholder}
              defaultDate={initialData?.checkIn}
              onChange={handleCheckInChange}
            />
          </div>
          <div>
            <DatePicker
              id="checkOut"
              label={t.newBooking.checkOut + " *"}
              placeholder={t.newBooking.checkOutPlaceholder}
              defaultDate={initialData?.checkOut || undefined}
              onChange={handleCheckOutChange}
            />
          </div>
        </div>

        {nights > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {nights} {nights === 1 ? "night" : "nights"} × Rp {formatIdr(pricePerNight)} = Rp {formatIdr(totalPrice)}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label htmlFor="pricePerNight">
              {t.newBooking.pricePerNight} <span className="text-error-500">*</span>
            </Label>
            <input
              id="pricePerNight"
              name="pricePerNight"
              type="text"
              inputMode="numeric"
              value={priceDisplay}
              onChange={handlePriceChange}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              required
            />
          </div>
          <div>
            <Label htmlFor="totalPrice">
              {t.newBooking.totalPrice} <span className="text-error-500">*</span>
            </Label>
            <input
              id="totalPrice"
              name="totalPrice"
              type="text"
              value={formatIdr(totalPrice)}
              disabled
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="downPayment">
              {t.newBooking.downPayment} <span className="text-error-500">*</span>
            </Label>
            <input
              id="downPayment"
              name="downPayment"
              type="text"
              inputMode="numeric"
              value={downPayment ? formatIdr(downPayment) : "0"}
              onChange={handleDownPaymentChange}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              required
              min="0"
            />
          </div>
        </div>

        {downPayment > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remaining: Rp {formatIdr(remaining)}
          </p>
        )}

        <div>
          <Label htmlFor="note">{t.newBooking.note}</Label>
          <InputField
            id="note"
            name="note"
            type="text"
            placeholder={t.newBooking.notePlaceholder}
            defaultValue={initialData?.note}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? t.newBooking.saving : initialData ? t.newBooking.updateBooking : t.newBooking.createBooking}
          </Button>
        </div>
      </div>
    </form>
  );
}
