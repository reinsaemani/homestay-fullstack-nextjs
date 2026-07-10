import Badge from "@/components/ui/badge/Badge";

type AvailableColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

interface StatusBadgeProps {
  label: string;
  color?: AvailableColor;
  size?: "sm" | "md";
}

export default function StatusBadge({
  label,
  color = "info",
  size = "sm",
}: StatusBadgeProps) {
  return (
    <Badge size={size} color={color}>
      {label}
    </Badge>
  );
}
