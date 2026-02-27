import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  delayMs?: number;
}

export const Tooltip = ({
  content,
  children,
  side = "top",
  className,
  delayMs = 300,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const offset = 8;
      let top = 0;
      let left = 0;
      if (side === "top") {
        top = rect.top + window.scrollY - offset;
        left = rect.left + window.scrollX + rect.width / 2;
      } else if (side === "bottom") {
        top = rect.bottom + window.scrollY + offset;
        left = rect.left + window.scrollX + rect.width / 2;
      } else if (side === "left") {
        top = rect.top + window.scrollY + rect.height / 2;
        left = rect.left + window.scrollX - offset;
      } else {
        top = rect.top + window.scrollY + rect.height / 2;
        left = rect.right + window.scrollX + offset;
      }
      setPos({ top, left });
      setVisible(true);
    }, delayMs);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const transformMap = {
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
    left: "translateX(-100%) translateY(-50%)",
    right: "translateY(-50%)",
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex"
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            className={cn(
              "animate-fade-in pointer-events-none fixed z-[100] rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md",
              className,
            )}
            style={{
              top: pos.top,
              left: pos.left,
              transform: transformMap[side],
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
