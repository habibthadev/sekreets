import { useState } from "react";
import {
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Star,
  GitBranch,
  Hash,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Secret } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/20",
  Anthropic: "bg-[#c96442]/10 text-[#c96442] border-[#c96442]/20",
  Google: "bg-[#4285f4]/10 text-[#4285f4] border-[#4285f4]/20",
  Groq: "bg-[#f55036]/10 text-[#f55036] border-[#f55036]/20",
  HuggingFace: "bg-[#ff9d00]/10 text-[#ff9d00] border-[#ff9d00]/20",
  Replicate: "bg-[#5c6ac4]/10 text-[#5c6ac4] border-[#5c6ac4]/20",
  Perplexity: "bg-[#20b2aa]/10 text-[#20b2aa] border-[#20b2aa]/20",
  Mistral: "bg-[#ff6b6b]/10 text-[#ff6b6b] border-[#ff6b6b]/20",
  Cohere: "bg-[#39a3f4]/10 text-[#39a3f4] border-[#39a3f4]/20",
  xAI: "bg-[#000000]/10 text-foreground border-border",
  Nvidia: "bg-[#76b900]/10 text-[#76b900] border-[#76b900]/20",
  OpenRouter: "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20",
};

const entropyColor = (e: number) => {
  if (e >= 4.5) return "text-destructive";
  if (e >= 3.5) return "text-warning-foreground";
  return "text-muted-foreground";
};

interface SecretCardProps {
  secret: Secret;
}

export const SecretCard = ({ secret }: SecretCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const copyMasked = () => {
    navigator.clipboard.writeText(secret.maskedValue).then(() => {
      toast.success("Masked value copied");
    });
  };

  const providerColorClass =
    PROVIDER_COLORS[secret.provider] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <div className="animate-fade-in rounded-lg border border-border bg-card transition-colors hover:border-foreground/20 flex flex-col min-w-0 overflow-hidden w-full">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2.5">
        <img
          src={secret.repoOwnerAvatar}
          alt={secret.repoOwner}
          className="h-6 w-6 rounded-full border border-border shrink-0 bg-muted"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://github.com/${secret.repoOwner}.png?size=24`;
          }}
        />
        <a
          href={secret.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 text-xs font-medium tracking-tight text-foreground hover:underline truncate"
        >
          {secret.repoFullName}
        </a>
        <span
          className={cn(
            "shrink-0 inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest leading-none",
            providerColorClass,
          )}
        >
          {secret.provider}
        </span>
      </div>

      <div className="px-3 pb-2.5">
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 min-w-0">
          <code className="flex-1 min-w-0 font-mono-data text-[11px] text-foreground truncate">
            {secret.maskedValue}
          </code>
          <Tooltip content="Copy masked value">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={copyMasked}
              className="shrink-0 h-6 w-6"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="px-3 pb-2.5 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <Tooltip content={`Shannon entropy: ${secret.entropy}`}>
          <span
            className={cn(
              "flex items-center gap-1 font-mono-data tabular-nums shrink-0",
              entropyColor(secret.entropy),
            )}
          >
            <Zap className="h-3 w-3" />
            {secret.entropy}
          </span>
        </Tooltip>
        {secret.stars > 0 && (
          <span className="flex items-center gap-1 font-mono-data tabular-nums shrink-0">
            <Star className="h-3 w-3" />
            {secret.stars.toLocaleString()}
          </span>
        )}
        <span className="flex items-center gap-1 tracking-tight min-w-0">
          <Hash className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {secret.patternName.replace(/_/g, " ")}
          </span>
        </span>
      </div>

      <div className="mx-3 mb-2.5 rounded-md border border-border bg-muted/20 px-2.5 py-1.5 flex items-center gap-2 min-w-0">
        <GitBranch className="h-3 w-3 text-muted-foreground shrink-0" />
        <a
          href={secret.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 font-mono-data text-[11px] text-muted-foreground hover:text-foreground truncate transition-colors"
        >
          {secret.filePath}
          {secret.lineNumber ? `:${secret.lineNumber}` : ""}
        </a>
        <a
          href={secret.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          aria-label="Open file"
        >
          <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
        </a>
      </div>

      {secret.fragment && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mx-3 mb-2.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-tight w-fit"
          >
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {expanded ? "Hide" : "Show"} snippet
          </button>
          {expanded && (
            <div className="mx-3 mb-2.5 rounded-md border border-border bg-muted/40 p-3 overflow-auto max-h-32">
              <pre className="font-mono-data text-[11px] text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">
                {secret.fragment}
              </pre>
            </div>
          )}
        </>
      )}

      <div className="mt-auto border-t border-border px-3 py-2 flex items-center justify-between gap-2">
        <span className="text-label text-muted-foreground truncate">
          {formatDistanceToNow(new Date(secret.discoveredAt), {
            addSuffix: true,
          })}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <a href={secret.fileUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 gap-1 tracking-tight"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">View file</span>
              <span className="sm:hidden">File</span>
            </Button>
          </a>
          <a href={secret.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 tracking-tight"
            >
              Repo
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
