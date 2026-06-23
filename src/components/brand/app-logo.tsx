import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md";
}

/** Brand mark — stacked timeline bars on navy */
export function AppLogo({ className, size = "md" }: AppLogoProps) {
  const box = size === "sm" ? "h-8 w-8 rounded-lg" : "h-9 w-9 rounded-[10px]";
  const icon = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 bg-[#1e40af] shadow-sm ring-1 ring-black/5",
        box,
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" className={icon} fill="none">
        <rect x="2" y="3.5" width="10" height="2.25" rx="1.125" fill="#93c5fd" />
        <rect x="2" y="8.375" width="15" height="2.25" rx="1.125" fill="#ffffff" />
        <rect x="2" y="13.25" width="7" height="2.25" rx="1.125" fill="#5eead4" />
        <circle cx="16.5" cy="5" r="1.25" fill="#fbbf24" />
      </svg>
    </div>
  );
}
