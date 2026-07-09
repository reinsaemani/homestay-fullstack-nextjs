import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  defaultLocale,
  getDictionary,
  hasLocale,
} from "@/dictionaries";

import BookingsPageClient from "./BookingsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.bookings.title,
    description: dict.bookings.description,
  };
}

export default function BookingsPage() {
  return <BookingsPageClient />;
}