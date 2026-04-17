import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, iconRight, onClear, value, ...props }, ref) => (
    <div className="relative flex items-center group w-full">
      {icon ? (
        <span className="pointer-events-none absolute left-3 text-muted-foreground transition-colors group-focus-within:text-foreground">
          {icon}
        </span>
      ) : null}
      <input
        ref={ref}
        value={value}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border bg-input/20 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground transition-all hover:bg-input/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-9" : "",
          iconRight || (onClear && value) ? "pr-9" : "",
          className,
        )}
        {...props}
      />
      {onClear && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClear}
          className="absolute right-1.5 h-7 w-7 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      {iconRight && !(onClear && value) ? (
        <span className="absolute right-3 text-muted-foreground transition-colors group-focus-within:text-foreground">
          {iconRight}
        </span>
      ) : null}
    </div>
  ),
);

Input.displayName = "Input";
