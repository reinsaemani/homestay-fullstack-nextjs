"use client";

import { useLocale } from "@/context/LocaleContext";

type DateLike = string | Date | { toISOString: () => string };

interface DateDisplayProps {
  date: DateLike;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

const defaultOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const localeMap: Record<string, string> = {
  id: "id-ID",
  en: "en-US",
};

function toDate(date: DateLike): Date {
  if (date instanceof Date) return date;
  if (typeof date === "string") return new Date(date);
  return new Date(date.toISOString());
}

export default function DateDisplay({ date, options, className }: DateDisplayProps) {
  const { locale } = useLocale();
  return (
    <span className={className}>
      {toDate(date).toLocaleDateString(localeMap[locale] || "en-US", options || defaultOptions)}
    </span>
  );
}

export function formatDate(date: DateLike, locale: string, opts?: Intl.DateTimeFormatOptions): string {
  return toDate(date).toLocaleDateString(localeMap[locale] || "en-US", opts || defaultOptions);
}
