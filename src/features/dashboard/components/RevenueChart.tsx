"use client";
import { useLocale } from "@/context/LocaleContext";
import dynamic from "next/dynamic";
import type { MonthlyRevenueItem } from "../types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface RevenueChartProps {
  data: MonthlyRevenueItem[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useLocale();
  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", fontFamily: "Outfit, sans-serif" },
    xaxis: {
      categories: data.map((d) => d.month),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)}jt`;
          if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
          return `${val}`;
        },
      },
    },
    colors: ["#2596be"],
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "60%" },
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)}jt`;
          if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}k`;
          return `Rp ${val}`;
        },
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: data.map((d) => d.revenue),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        {t.dashboard.monthlyRevenue}
      </h3>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
