"use client";
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = "No data",
  description = "No records to display.",
  action,
}: EmptyStateProps) {
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
        {title}
      </h4>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {action}
    </div>
  );
}
