import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getBookingByDisplayId } from "@/features/bookings/services/getBookingById";
import BookingDetailCard from "@/features/bookings/components/BookingDetailCard";
import BookingDetailActions from "./BookingDetailActions";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { PencilIcon } from "@/icons";
import { getDictionary, hasLocale, defaultLocale } from "@/dictionaries";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.bookingDetail.title,
    description: dict.bookingDetail.description,
  };
}

export default async function BookingDetailPage({
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
        <PageBreadcrumb pageTitle={dict.bookingDetail.notFound} />
        <p className="text-gray-500">{dict.bookingDetail.notFoundDesc}</p>
      </div>
    );
  }

  const serialized = {
    ...booking,
    pricePerNight: Number(booking.pricePerNight),
    totalPrice: Number(booking.totalPrice),
    downPayment: Number(booking.downPayment),
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={dict.bookingDetail.pageTitle} />
      <div className="space-y-6">
        <BookingDetailCard booking={serialized} />
        <div className="flex items-center gap-3">
          <BookingDetailActions bookingId={booking.id} displayId={booking.displayId} status={booking.status} />
          <Link href={`/bookings/${displayId}/edit`}>
            <Button size="sm" variant="outline" startIcon={<PencilIcon />}>
              {dict.common.edit}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
