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
  Terminal,
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
    <div className="group animate-fade-in rounded-xl border border-border bg-card transition-all duration-300 hover:border-foreground/30 hover:shadow-lg hover:-translate-y-1 flex flex-col min-w-0 overflow-hidden w-full">
      {}
      <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
        <div className="bg-dots w-16 h-16" />
      </div>

      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="relative shrink-0">
          <img
            src={secret.repoOwnerAvatar}
            alt={secret.repoOwner}
            className="h-8 w-8 rounded-full border border-border bg-muted shadow-sm"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                `https://github.com/${secret.repoOwner}.png?size=32`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-success border-2 border-card" />
        </div>
        <div className="flex-1 min-w-0">
          <a
            href={secret.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold tracking-tight text-foreground hover:underline truncate"
          >
            {secret.repoFullName}
          </a>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={cn(
                "inline-flex items-center rounded-sm border px-1.5 py-0 text-[10px] font-bold uppercase tracking-widest leading-none h-4",
                providerColorClass,
              )}
            >
              {secret.provider}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="group/code relative flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 min-w-0 transition-colors hover:bg-muted/50">
          <code className="flex-1 min-w-0 font-mono-data text-[11px] text-foreground truncate selection:bg-foreground selection:text-background">
            {secret.maskedValue}
          </code>
          <Tooltip content="Copy masked value">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={copyMasked}
              className="shrink-0 h-7 w-7 opacity-50 group-hover/code:opacity-100 transition-opacity"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <Tooltip content={`Shannon entropy: ${secret.entropy}`}>
          <div
            className={cn(
              "flex items-center gap-1.5 font-mono-data tabular-nums shrink-0 px-1.5 py-0.5 rounded bg-muted/20",
              entropyColor(secret.entropy),
            )}
          >
            <Zap className="h-3 w-3" />
            {secret.entropy}
          </div>
        </Tooltip>
        {secret.stars > 0 && (
          <div className="flex items-center gap-1.5 font-mono-data tabular-nums shrink-0">
            <Star className="h-3.5 w-3.5 text-yellow-500/80" />
            {secret.stars.toLocaleString()}
          </div>
        )}
        <div className="flex items-center gap-1.5 tracking-tight min-w-0">
          <Hash className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="truncate opacity-80">
            {secret.patternName.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="mx-4 mb-3 rounded-lg border border-border bg-muted/10 px-3 py-2 flex items-center gap-2.5 min-w-0 hover:bg-muted/20 transition-colors">
        <GitBranch className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open file"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {secret.fragment && (
        <div className="mx-4 mb-3 flex flex-col">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-tight w-fit py-1"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {expanded ? "Hide" : "Show"} code snippet
          </button>
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out overflow-hidden",
              expanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0">
              <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono-data text-[11px] text-muted-foreground whitespace-pre-wrap break-all leading-relaxed relative">
                <div className="absolute top-0 right-0 p-1.5 opacity-20">
                  <Terminal className="h-3 w-3" />
                </div>
                {secret.fragment}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto bg-muted/5 px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground tabular-nums">
          {formatDistanceToNow(new Date(secret.discoveredAt), {
            addSuffix: true,
          })}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <a href={secret.fileUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-semibold gap-1.5 transition-all hover:bg-foreground hover:text-background"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View</span>
            </Button>
          </a>
          <a href={secret.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs font-semibold"
            >
              Repo
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
