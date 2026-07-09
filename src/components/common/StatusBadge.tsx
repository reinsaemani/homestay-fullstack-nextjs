"use client";
import Badge from "@/components/ui/badge/Badge";
import { useLocale } from "@/context/LocaleContext";

type StatusColor = "success" | "warning" | "info" | "error";

const STATUS_COLORS: Record<string, StatusColor> = {
  BOOKED: "info",
  CHECKED_IN: "success",
  CHECKED_OUT: "warning",
  CANCELLED: "error",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLocale();
  const color = STATUS_COLORS[status] || "info";
  const label = (t.status as Record<string, string>)[status] || status;
  return (
    <Badge size="sm" color={color}>
      {label}
    </Badge>
  );
}

export { STATUS_COLORS as STATUS_CONFIG };
