"use client";
import React from "react";
import { useLocale } from "@/context/LocaleContext";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  const { t } = useLocale();
  const resolvedTitle = title ?? t.common.noData;
  const resolvedDescription = description ?? t.common.noRecords;
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/[0.03]">
        <svg
          className="fill-gray-500 dark:fill-gray-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
        </svg>
      </div>
      <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {resolvedTitle}
      </h4>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {resolvedDescription}
      </p>
      {action}
    </div>
  );
}
