const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

interface CurrencyDisplayProps {
  amount: number | string | bigint | { toNumber: () => number };
  className?: string;
}

export default function CurrencyDisplay({ amount, className }: CurrencyDisplayProps) {
  const value = toNumber(amount);
  return (
    <span className={className}>
      {currencyFormatter.format(value)}
    </span>
  );
}

export function formatIDR(amount: number | string | bigint | { toNumber: () => number }): string {
  return currencyFormatter.format(toNumber(amount));
}

function toNumber(amount: number | string | bigint | { toNumber: () => number }): number {
  if (typeof amount === "number") return amount;
  if (typeof amount === "string") return Number(amount);
  if (typeof amount === "bigint") return Number(amount);
  return amount.toNumber();
}
