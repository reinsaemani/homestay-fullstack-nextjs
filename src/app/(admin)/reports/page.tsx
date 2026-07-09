"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/context/LocaleContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/common/EmptyState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

type Period = "weekly" | "monthly" | "yearly";

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years;
}

export default function ReportsPage() {
  const { t } = useLocale();
  const [period, setPeriod] = useState<Period>("monthly");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0"),
  );
  const [week, setWeek] = useState("01");
  const [data, setData] = useState<{ items: { date: string; income: number }[]; total: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const getValue = useCallback(() => {
    if (period === "yearly") return year;
    if (period === "monthly") return `${year}-${month}`;
    return `${year}-W${week}`;
  }, [period, year, month, week]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const value = getValue();
      const res = await fetch(`/api/reports/income?period=${period}&value=${value}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period, getValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownloadCSV = () => {
    if (!data || data.items.length === 0) return;
    const header = `${t.reports.paymentDate},${t.reports.income}`;
    const rows = data.items.map((item) => `${item.date},${item.income}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `income-report-${getValue()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const yearOptions = getYearOptions();

  return (
    <div>
      <PageBreadcrumb pageTitle={t.reports.pageTitle} />
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            {t.reports.selectPeriod}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {t.reports[p]}
                </button>
              ))}
            </div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <option value="">{t.reports.selectYear}</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {period === "monthly" && (
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                <option value="">{t.reports.selectMonth}</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
            {period === "weekly" && (
              <select
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                <option value="">{t.reports.selectWeek}</option>
                {Array.from({ length: 53 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={String(w).padStart(2, "0")}>
                    {t.reports.weekPrefix}{w}
                  </option>
                ))}
              </select>
            )}
            {data && data.items.length > 0 && (
              <Button size="sm" variant="outline" onClick={handleDownloadCSV}>
                {t.reports.download}
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton rows={5} columns={2} />
            </div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              title={t.reports.noData}
              description=""
            />
          ) : (
            <>
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[400px]">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          {t.reports.paymentDate}
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          {t.reports.income}
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {data.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.date}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                              Rp {item.income.toLocaleString("id-ID")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {t.reports.totalIncome}
                </span>
                <span className="text-sm font-semibold text-brand-500">
                  Rp {data.total.toLocaleString("id-ID")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
