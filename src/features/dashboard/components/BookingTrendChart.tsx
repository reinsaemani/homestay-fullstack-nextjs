"use client";
import { useLocale } from "@/context/LocaleContext";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface BookingTrendChartProps {
  data: { month: string; bookings: number }[];
}

export default function BookingTrendChart({ data }: BookingTrendChartProps) {
  const { t } = useLocale();
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
    },
    xaxis: {
      categories: data.map((d) => d.month),
    },
    colors: ["#10B981", "#465FFF"],
    stroke: { curve: "smooth", width: 2 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} bookings`,
      },
    },
  };

  const series = [
    {
      name: "Bookings",
      data: data.map((d) => d.bookings),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        {t.dashboard.bookingTrends}
      </h3>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
