import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Trophy,
  Medal,
  GitFork,
  Key,
  Star,
  Clock,
  ExternalLink,
  Filter,
  Award,
} from "lucide-react";
import type { LeaderboardEntry } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useProviders } from "@/hooks/useProviders";

const RANK_ICON: Record<
  number,
  { icon: React.ElementType; className: string }
> = {
  1: { icon: Trophy, className: "h-4 w-4 text-yellow-500" },
  2: { icon: Medal, className: "h-4 w-4 text-zinc-400" },
  3: { icon: Award, className: "h-4 w-4 text-amber-600" },
};

const RANK_BG: Record<number, string> = {
  1: "border-yellow-500/30 bg-yellow-500/5",
  2: "border-zinc-400/30 bg-zinc-400/5",
  3: "border-amber-600/30 bg-amber-600/5",
};

const RankCell = ({ rank }: { rank: number }) => {
  const ranked = RANK_ICON[rank];
  if (ranked) {
    const Icon = ranked.icon;
    return (
      <div className="flex items-center justify-center w-8 shrink-0">
        <Icon className={ranked.className} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 shrink-0">
      <span className="text-sm font-mono-data text-muted-foreground font-medium tabular-nums">
        {rank}
      </span>
    </div>
  );
};

const ProviderChips = ({
  providers,
  max = 4,
}: {
  providers: string[];
  max?: number;
}) => {
  const visible = providers.slice(0, max);
  const overflow = providers.length - max;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((p) => (
        <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0">
          {p}
        </Badge>
      ))}
      {overflow > 0 && (
        <Tooltip content={providers.slice(max).join(", ")}>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 cursor-default"
          >
            +{overflow}
          </Badge>
        </Tooltip>
      )}
    </div>
  );
};

const EntryCard = ({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) => {
  const borderClass = RANK_BG[rank] ?? "border-border bg-card";

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/40 ${borderClass}`}
    >
      <RankCell rank={rank} />

      <a
        href={`https://github.com/${entry.login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 mt-0.5"
        aria-label={`${entry.login} on GitHub`}
      >
        <img
          src={entry.avatar}
          alt={entry.login}
          width={36}
          height={36}
          className="rounded-full border border-border object-cover w-9 h-9 sm:w-10 sm:h-10"
          loading="lazy"
        />
      </a>

      <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <a
            href={`https://github.com/${entry.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-sm tracking-tight hover:underline underline-offset-2 truncate max-w-full"
          >
            <span className="truncate">{entry.login}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
          </a>

          <Tooltip content="Total exposed secrets">
            <span className="flex items-center gap-1 text-xs font-mono-data font-bold text-destructive">
              <Key className="h-3 w-3" />
              {entry.totalSecrets.toLocaleString()}
              <span className="font-normal text-muted-foreground">secrets</span>
            </span>
          </Tooltip>
        </div>

        <ProviderChips providers={entry.providers} />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <Tooltip content="Affected repositories">
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {entry.repoCount} {entry.repoCount === 1 ? "repo" : "repos"}
            </span>
          </Tooltip>

          {entry.maxStars > 0 && (
            <Tooltip content="Stars on highest-starred affected repo">
              <span className="flex items-center gap-1 font-mono-data">
                <Star className="h-3 w-3" />
                {entry.maxStars.toLocaleString()}
              </span>
            </Tooltip>
          )}

          <Tooltip
            content={`Latest exposure: ${new Date(entry.latestExposure).toLocaleString()}`}
          >
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(entry.latestExposure), {
                addSuffix: true,
              })}
            </span>
          </Tooltip>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end shrink-0 gap-0.5">
        <span className="text-numeric text-xl leading-none">
          {entry.totalSecrets.toLocaleString()}
        </span>
        <span className="text-label text-muted-foreground">secrets</span>
      </div>
    </div>
  );
};

const EntrySkeleton = () => (
  <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
    <Skeleton className="h-5 w-8 shrink-0" />
    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
    <div className="flex-1 space-y-2 pt-0.5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="hidden sm:block h-8 w-12" />
  </div>
);

const LIMIT_OPTIONS: SelectOption[] = [
  { value: "10", label: "Top 10" },
  { value: "20", label: "Top 20" },
  { value: "50", label: "Top 50" },
  { value: "100", label: "Top 100" },
];

export const LeaderboardPage = () => {
  const [provider, setProvider] = useState<string>("");
  const [limit, setLimit] = useState(20);

  const leaderboardQuery = useLeaderboard({ provider, limit });
  const providersQuery = useProviders();

  const providerOptions: SelectOption[] = [
    { value: "", label: "All providers" },
    ...(providersQuery.data ?? []).map((p) => ({ value: p, label: p })),
  ];

  const entries = leaderboardQuery.data ?? [];
  const isLoading = leaderboardQuery.isLoading;

  return (
    <div className="min-h-screen">
      <div className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
                <h1 className="text-base font-semibold tracking-tight leading-tight">
                  Hall of Shame
                </h1>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                Developers with the most exposed AI API keys on public GitHub
                repositories
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 sm:flex-none sm:w-44">
                <Select
                  value={provider}
                  onChange={setProvider}
                  options={providerOptions}
                  placeholder="All providers"
                />
              </div>
              <div className="w-24 sm:w-28 shrink-0">
                <Select
                  value={String(limit)}
                  onChange={(v) => setLimit(Number(v))}
                  options={LIMIT_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-3">
        {!isLoading && entries.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
            <span>
              {entries.length} developer{entries.length !== 1 ? "s" : ""} ranked
              {provider ? ` · filtered by ${provider}` : ""}
            </span>
            {leaderboardQuery.dataUpdatedAt > 0 && (
              <span>
                Updated{" "}
                {formatDistanceToNow(leaderboardQuery.dataUpdatedAt, {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <EntrySkeleton key={i} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
              <Trophy className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-medium">No data yet</h3>
            <p className="max-w-xs text-xs text-muted-foreground">
              {provider
                ? `No exposed secrets found for ${provider}. Try another provider or run a scan.`
                : "Run a scan first to populate the leaderboard."}
            </p>
            {provider && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setProvider("")}
              >
                Clear filter
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {entries.map((entry, i) => (
              <EntryCard key={entry.login} entry={entry} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
