"use client";
import { useLocale } from "@/context/LocaleContext";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface OccupancyRateProps {
  rate: number;
}

export default function OccupancyRate({ rate }: OccupancyRateProps) {
  const { t } = useLocale();
  const options: ApexCharts.ApexOptions = {
    chart: { type: "radialBar", fontFamily: "Outfit, sans-serif" },
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            fontSize: "18px",
            fontWeight: 600,
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    colors: ["#d6188a"],
    labels: ["Occupancy"],
  };

  const series = [rate];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
        {t.dashboard.occupancyRate}
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={220}
      />
    </div>
  );
}
