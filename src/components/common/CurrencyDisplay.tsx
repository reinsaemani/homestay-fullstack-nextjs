interface CurrencyDisplayProps {
  amount: number | string | bigint | { toNumber: () => number };
  locale?: string;
  currency?: string;
  options?: Intl.NumberFormatOptions;
  className?: string;
}

const defaultOptions: Intl.NumberFormatOptions = {
  style: "currency",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

function toNumber(amount: number | string | bigint | { toNumber: () => number }): number {
  if (typeof amount === "number") return amount;
  if (typeof amount === "string") return Number(amount);
  if (typeof amount === "bigint") return Number(amount);
  return amount.toNumber();
}

function createFormatter(locale: string, currency: string, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, {
    ...defaultOptions,
    ...opts,
    currency,
  });
}

export default function CurrencyDisplay({
  amount,
  locale = "id-ID",
  currency = "IDR",
  options,
  className,
}: CurrencyDisplayProps) {
  const value = toNumber(amount);
  const formatter = createFormatter(locale, currency, options);
  return (
    <span className={className}>
      {formatter.format(value)}
    </span>
  );
}

export function formatIDR(
  amount: number | string | bigint | { toNumber: () => number },
  locale = "id-ID",
  currency = "IDR",
): string {
  return createFormatter(locale, currency).format(toNumber(amount));
}
