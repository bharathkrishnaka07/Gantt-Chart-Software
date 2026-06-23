import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LockBadgeProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function LockBadge({ className, showLabel = true, size = "sm" }: LockBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 font-medium shrink-0",
        size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs",
        className
      )}
    >
      <Lock className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
      {showLabel && "Locked"}
    </Badge>
  );
}

interface LockIconProps {
  className?: string;
}

export function LockIcon({ className }: LockIconProps) {
  return (
    <Lock
      className={cn("h-3 w-3 text-muted-foreground shrink-0", className)}
      aria-label="Locked"
    />
  );
}
