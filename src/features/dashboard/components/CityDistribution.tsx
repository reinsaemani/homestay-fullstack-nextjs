"use client";
import { useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";
import dynamic from "next/dynamic";
import type { CityDistributionItem } from "../types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CityDistributionProps {
  data: CityDistributionItem[];
}

const PIE_COLORS = [
  "#465FFF",
  "#EE6C01",
  "#2596be",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export default function CityDistribution({ data }: CityDistributionProps) {
  const { t } = useLocale();

  const options = useMemo(
    () => ({
      chart: { type: "pie" as const, fontFamily: "Outfit, sans-serif" },
      labels: data.map((d) => d.city),
      colors: PIE_COLORS.slice(0, data.length),
      legend: { position: "bottom" as const },
      dataLabels: {
        formatter: (_val: string | number, opts?: unknown) => {
          const seriesIndex = (opts as { seriesIndex?: number } | undefined)?.seriesIndex ?? 0;
          const total = data.reduce((s, d) => s + d.count, 0);
          const pct = total > 0 ? ((data[seriesIndex]?.count ?? 0) / total * 100).toFixed(1) : "0";
          return `${pct}%`;
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} tamu`,
        },
      },
    }),
    [data],
  );

  const series = data.map((d) => d.count);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
        {t.dashboard.cityDistribution}
      </h3>
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">Belum ada data kota</p>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={280}
        />
      )}
    </div>
  );
}
