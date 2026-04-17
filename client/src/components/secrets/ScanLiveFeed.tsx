import {
  Wifi,
  WifiOff,
  Loader2,
  KeyRound,
  CheckCircle2,
  XCircle,
  X,
  Terminal,
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
      <div className="flex items-start gap-3 py-2 px-3 rounded-md bg-muted/20 border border-border/40 animate-slide-up relative overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-1 bg-primary/40 animate-pulse" />
        <Loader2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0 animate-spin" />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium tracking-tight text-foreground/90 truncate block">
            {item.repo}
          </span>
          <span className="font-mono-data text-[10px] text-muted-foreground truncate block opacity-70">
            {item.file}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-muted-foreground/60 animate-scan-pulse">
            scanning
          </span>
        </div>
      </div>
    );
  }

  if (item.type === "found") {
    return (
      <div className="flex items-start gap-3 py-2 px-3 rounded-md bg-background border border-primary/20 animate-slide-up ring-1 ring-primary/5 overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-1 bg-destructive animate-pulse" />
        <KeyRound className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1 overflow-hidden space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center rounded-sm border px-1.5 py-0 text-[9px] font-bold uppercase tracking-widest h-4",
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
                className="font-mono-data text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-muted-foreground/30 truncate max-w-[140px] sm:max-w-[220px]"
              >
                {item.repo}/{item.file}
              </a>
            ) : (
              <span className="font-mono-data text-[10px] text-muted-foreground truncate max-w-[140px] sm:max-w-[220px]">
                {item.repo}
              </span>
            )}
          </div>
          <span className="font-mono-data text-[10px] text-foreground font-medium block truncate selection:bg-destructive selection:text-white">
            {item.maskedValue}
          </span>
        </div>
        <span className="text-[10px] font-bold text-destructive shrink-0">
          found
        </span>
      </div>
    );
  }

  if (item.type === "done") {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-foreground text-background border border-foreground animate-slide-up">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span className="text-xs font-medium tracking-tight flex-1">
          Scan complete —{" "}
          <span className="font-mono-data font-bold bg-background text-foreground px-1 py-0.5 rounded ml-1">
            {item.total ?? 0}
          </span>{" "}
          new secrets discovered
        </span>
      </div>
    );
  }

  if (item.type === "error") {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-destructive/10 border border-destructive/30 animate-slide-up">
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
    className="flex items-center gap-3 py-2.5 px-3 rounded-md border border-transparent"
    aria-hidden
  >
    <div className="h-3.5 w-3.5 rounded bg-blue-100 dark:bg-muted-foreground/20 shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-2.5 w-24 bg-blue-100 dark:bg-muted-foreground/20 rounded" />
      <div className="h-1.5 w-32 bg-blue-50/50 dark:bg-muted-foreground/10 rounded" />
    </div>
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
        "rounded-lg border border-border bg-card shadow-lg overflow-hidden relative",
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            {isConnected ? (
              <>
                {isActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground" />
            )}
          </span>
          <span className="text-xs font-semibold tracking-tight">
            Live scan feed
          </span>
          {isConnected ? (
            <Badge variant="outline" className="text-[10px] py-0 h-4 border-success/30 bg-success/5 text-success">
              connected
            </Badge>
          ) : (
            <Badge variant="muted" className="text-[10px] py-0 h-4">
              offline
            </Badge>
          )}
          {foundCount > 0 && (
            <Badge
              variant="default"
              className="text-[10px] py-0 h-4 font-mono-data bg-destructive hover:bg-destructive"
            >
              {foundCount} found
            </Badge>
          )}
        </div>
        {items.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={clear}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div className="p-2.5 sm:p-3 space-y-1.5 max-h-[360px] overflow-y-auto">
        {items.length === 0 ? (
          <>
            <div className="flex items-center gap-2 py-2 px-3 rounded-md border border-transparent opacity-50">
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {isConnected
                  ? "Waiting for scan events..."
                  : "Connecting to scan stream..."}
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
      
      {}
      <div className="px-4 py-1.5 bg-muted/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-success animate-pulse" />
          <span className="text-[9px] font-mono-data text-muted-foreground/70">
            stream active
          </span>
        </div>
      </div>
    </div>
  );
};
