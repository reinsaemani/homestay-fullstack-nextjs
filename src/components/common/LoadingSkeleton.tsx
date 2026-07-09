import React from "react";

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function LoadingSkeleton({
  rows = 5,
  columns = 4,
}: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={c}
              className="h-4 flex-1 rounded bg-gray-200 dark:bg-white/[0.05]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
