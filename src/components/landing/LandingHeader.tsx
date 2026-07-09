"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useLocale } from "@/context/LocaleContext";

export default function LandingHeader() {
  const { data: session } = useSession();
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/Logo.png"
            alt="Bee Nirwana Homestay"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Bee Nirwana Homestay
          </span>
        </Link>
        {session ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            {t.landing.dashboard}
          </Link>
        ) : (
          <Link
            href="/signin"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            {t.landing.login}
          </Link>
        )}
      </div>
    </header>
  );
}
