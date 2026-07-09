"use client";
import { useLocale } from "@/context/LocaleContext";
import type { DashboardMetrics } from "../types";

function formatK(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return String(value);
}

interface TodayMetricsCardsProps {
  metrics: DashboardMetrics;
}

export default function TodayMetricsCards({
  metrics,
}: TodayMetricsCardsProps) {
  const { t } = useLocale();
  const cards = [
    {
      label: t.dashboard.totalBookings,
      value: metrics.totalBookings.toLocaleString(),
    },
    {
      label: t.dashboard.activeGuests,
      value: metrics.activeGuests.toLocaleString(),
    },
    {
      label: t.dashboard.todayRevenue,
      value: `Rp ${formatK(metrics.todayRevenue)}`,
    },
    {
      label: t.dashboard.pendingCheckIns,
      value: metrics.pendingCheckIns.toLocaleString(),
    },
    {
      label: t.dashboard.piggyBank || "Celengan",
      value: `Rp ${formatK(metrics.piggyBankTotal)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-4xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {card.label}
          </p>
          <p className="break-words text-2xl font-semibold text-gray-800 dark:text-white/90">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
