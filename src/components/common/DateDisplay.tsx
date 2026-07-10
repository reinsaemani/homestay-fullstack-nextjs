type DateLike = string | Date | { toISOString: () => string };

interface DateDisplayProps {
  date: DateLike;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

const defaultOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

function toDate(date: DateLike): Date {
  if (date instanceof Date) return date;
  if (typeof date === "string") return new Date(date);
  return new Date(date.toISOString());
}

export default function DateDisplay({ date, locale = "id-ID", options, className }: DateDisplayProps) {
  return (
    <span className={className}>
      {toDate(date).toLocaleDateString(locale, options || defaultOptions)}
    </span>
  );
}

export function formatDate(date: DateLike, locale = "id-ID", opts?: Intl.DateTimeFormatOptions): string {
  return toDate(date).toLocaleDateString(locale, opts || defaultOptions);
}
