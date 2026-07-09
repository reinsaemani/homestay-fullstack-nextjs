import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import NewBookingForm from "./NewBookingForm";
import { getDictionary, hasLocale, defaultLocale } from "@/dictionaries";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.newBooking.title,
    description: dict.newBooking.description,
  };
}

export default async function NewBookingPage() {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div>
      <PageBreadcrumb pageTitle={dict.newBooking.pageTitle} />
      <div className="space-y-6">
        <ComponentCard title={dict.newBooking.bookingInformation}>
          <NewBookingForm />
        </ComponentCard>
      </div>
    </div>
  );
}
