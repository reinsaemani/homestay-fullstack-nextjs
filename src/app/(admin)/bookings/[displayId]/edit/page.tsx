import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { getBookingByDisplayId } from "@/features/bookings/services/getBookingById";
import EditBookingForm from "./EditBookingForm";
import { getDictionary, hasLocale, defaultLocale } from "@/dictionaries";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.editBooking.title,
    description: dict.editBooking.description,
  };
}

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  const { displayId } = await params;
  const booking = await getBookingByDisplayId(Number(displayId));
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);

  if (!booking) {
    return (
      <div>
        <PageBreadcrumb pageTitle={dict.editBooking.notFound} />
        <p className="text-gray-500">{dict.editBooking.notFoundDesc}</p>
      </div>
    );
  }

  function toLocalDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const initialData = {
    guestName: booking.guestName,
    phoneNumber: booking.phoneNumber,
    city: booking.city || undefined,
    checkIn: toLocalDateString(booking.checkIn),
    checkOut: toLocalDateString(booking.checkOut),
    pricePerNight: Number(booking.pricePerNight),
    totalPrice: Number(booking.totalPrice),
    downPayment: Number(booking.downPayment),
    note: booking.note || undefined,
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={dict.editBooking.pageTitle} />
      <div className="space-y-6">
        <ComponentCard title={dict.editBooking.editBookingInfo}>
          <EditBookingForm displayId={displayId} initialData={initialData} />
        </ComponentCard>
      </div>
    </div>
  );
}
