import LandingHeader from "@/components/landing/LandingHeader";
import BookingCalendar from "@/components/landing/BookingCalendar";
import { getDictionary, hasLocale, defaultLocale } from "@/dictionaries";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("locale")?.value || defaultLocale;
  const locale = hasLocale(localeVal) ? localeVal : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {dict.landing.siteName}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {dict.landing.subtitle}
          </p>
        </div>
        <BookingCalendar />
      </main>
    </div>
  );
}
