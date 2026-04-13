import {
  Wifi,
  WifiOff,
  Loader2,
  KeyRound,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type FeedItem } from "@/hooks/useScanFeed";
import { useScanFeedContext } from "@/store/scan-feed.context";
import { cn } from "@/lib/utils";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/20",
  Anthropic: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Google: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  HuggingFace: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Groq: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Mistral: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Cohere: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  default: "bg-muted text-muted-foreground border-border",
};

const providerColor = (provider?: string) =>
  provider
    ? (PROVIDER_COLORS[provider] ?? PROVIDER_COLORS.default)
    : PROVIDER_COLORS.default;

const SLOT_COUNT = 5;

const FeedRow = ({ item }: { item: FeedItem }) => {
  if (item.type === "scanning") {
    return (
      <div className="flex items-start gap-2 py-2 px-3 rounded-md bg-muted/40 border border-border/60 animate-slide-up">
        <Loader2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0 animate-spin" />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium tracking-tight text-foreground truncate block">
            {item.repo}
          </span>
          <span className="font-mono-data text-[11px] text-muted-foreground truncate block">
            {item.file}
          </span>
        </div>
        <span className="text-label text-muted-foreground shrink-0">
          scanning
        </span>
      </div>
    );
  }

  if (item.type === "found") {
    return (
      <div className="flex items-start gap-2 py-2 px-3 rounded-md bg-background border border-border animate-slide-up ring-1 ring-foreground/5 overflow-hidden">
        <KeyRound className="h-3.5 w-3.5 text-foreground mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1 overflow-hidden space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center rounded-sm border px-1.5 py-0 text-[10px] font-semibold uppercase tracking-widest",
                providerColor(item.provider),
              )}
            >
              {item.provider}
            </span>
            {item.fileUrl ? (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-data text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 truncate max-w-[140px] sm:max-w-[220px] md:max-w-xs"
              >
                {item.repo}/{item.file}
              </a>
            ) : (
              <span className="font-mono-data text-[11px] text-muted-foreground truncate max-w-[140px] sm:max-w-[220px] md:max-w-xs">
                {item.repo}
              </span>
            )}
          </div>
          <span className="font-mono-data text-[11px] text-foreground/70 block truncate">
            {item.maskedValue}
          </span>
        </div>
        <span className="text-label text-green-600 shrink-0 font-semibold">
          found
        </span>
      </div>
    );
  }

  if (item.type === "done") {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-foreground text-background border border-foreground animate-slide-up">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span className="text-xs font-medium tracking-tight flex-1">
          Scan complete —{" "}
          <span className="font-mono-data font-bold">{item.total ?? 0}</span>{" "}
          new secrets discovered
        </span>
      </div>
    );
  }

  if (item.type === "error") {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-destructive/10 border border-destructive/20 animate-slide-up">
        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
        <span className="text-xs text-destructive flex-1 leading-snug">
          {item.message}
        </span>
      </div>
    );
  }

  return null;
};

const PlaceholderRow = () => (
  <div
    className="flex items-center gap-2 py-2 px-3 rounded-md border border-transparent"
    aria-hidden
  >
    <span className="h-3.5 w-3.5 shrink-0" />
    <span className="text-xs text-transparent select-none">—</span>
  </div>
);

interface ScanLiveFeedProps {
  className?: string;
}

export const ScanLiveFeed = ({ className }: ScanLiveFeedProps) => {
  const { items, isConnected, foundCount, clear } = useScanFeedContext();

  const isActive = items.some(
    (i) => i.type === "scanning" || i.type === "found",
  );

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            {isConnected ? (
              <>
                {isActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-60" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground" />
            )}
          </span>
          <span className="text-xs font-semibold tracking-tight">
            Live Scan Feed
          </span>
          {isConnected ? (
            <Badge variant="secondary" className="text-[10px] py-0 h-4">
              <Wifi className="h-2.5 w-2.5 mr-1" />
              connected
            </Badge>
          ) : (
            <Badge variant="muted" className="text-[10px] py-0 h-4">
              <WifiOff className="h-2.5 w-2.5 mr-1" />
              waiting
            </Badge>
          )}
          {foundCount > 0 && (
            <Badge
              variant="default"
              className="text-[10px] py-0 h-4 font-mono-data"
            >
              {foundCount} found
            </Badge>
          )}
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="icon-sm" onClick={clear}>
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div className="p-2.5 sm:p-3 space-y-1.5">
        {items.length === 0 ? (
          <>
            <div className="flex items-center gap-2 py-2 px-3 rounded-md border border-transparent">
              <span className="h-3.5 w-3.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {isConnected
                  ? "Waiting for scan events…"
                  : "Connecting to scan stream…"}
              </p>
            </div>
            {Array.from({ length: SLOT_COUNT - 1 }).map((_, i) => (
              <PlaceholderRow key={i} />
            ))}
          </>
        ) : (
          <>
            {items.map((item) => (
              <FeedRow key={item.id} item={item} />
            ))}
            {Array.from({ length: Math.max(0, SLOT_COUNT - items.length) }).map(
              (_, i) => (
                <PlaceholderRow key={`ph-${i}`} />
              ),
            )}
          </>
        )}
      </div>
    </div>
  );
};
