import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, iconRight, ...props }, ref) => (
    <div className="relative flex items-center">
      {icon ? (
        <span className="pointer-events-none absolute left-3 text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-border bg-input/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-9" : "",
          iconRight ? "pr-9" : "",
          className,
        )}
        {...props}
      />
      {iconRight ? (
        <span className="absolute right-3 text-muted-foreground">
          {iconRight}
        </span>
      ) : null}
    </div>
  ),
);

Input.displayName = "Input";
