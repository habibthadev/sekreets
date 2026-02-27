import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export const Progress = ({
  value,
  max = 100,
  className,
  barClassName,
  showLabel,
}: ProgressProps) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-all duration-500 ease-out",
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs text-muted-foreground font-mono-data">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};
