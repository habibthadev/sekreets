import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SecretCard } from "@/components/secrets/SecretCard";
import { StatsBar } from "@/components/secrets/StatsBar";
import { ScanLiveFeed } from "@/components/secrets/ScanLiveFeed";
import { useSecrets, useInvalidateSecrets } from "@/hooks/useSecrets";
import { useStats, useInvalidateStats } from "@/hooks/useStats";
import { useProviders } from "@/hooks/useProviders";
import { useFilterStore } from "@/store/filter.store";
import type { SecretsParams } from "@/lib/api";

const SORT_OPTIONS: SelectOption[] = [
  { value: "discoveredAt", label: "Newest first" },
  { value: "entropy", label: "Highest entropy" },
  { value: "stars", label: "Most starred repo" },
];

const LIMIT_OPTIONS: SelectOption[] = [
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
  { value: "50", label: "50 per page" },
];

const paramsFromSearch = (sp: URLSearchParams): SecretsParams => ({
  page: Number(sp.get("page") ?? 1),
  limit: Number(sp.get("limit") ?? 20),
  provider: sp.get("provider") ?? undefined,
  search: sp.get("search") ?? undefined,
  sortBy: (sp.get("sortBy") as SecretsParams["sortBy"]) ?? "discoveredAt",
  order: (sp.get("order") as SecretsParams["order"]) ?? "desc",
  cursor: sp.get("cursor") ?? undefined,
  repo: undefined,
});

const searchFromParams = (p: SecretsParams): URLSearchParams => {
  const sp = new URLSearchParams();
  if (p.page && p.page > 1) sp.set("page", String(p.page));
  if (p.limit && p.limit !== 20) sp.set("limit", String(p.limit));
  if (p.provider) sp.set("provider", p.provider);
  if (p.search) sp.set("search", p.search);
  if (p.sortBy && p.sortBy !== "discoveredAt") sp.set("sortBy", p.sortBy);
  if (p.order && p.order !== "desc") sp.set("order", p.order);
  if (p.cursor) sp.set("cursor", p.cursor);
  return sp;
};

export const SecretsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { goNext, goPrev, cursorHistory, syncFromUrl, resetFilters } =
    useFilterStore();

  useEffect(() => {
    const p = paramsFromSearch(searchParams);
    if (!p.cursor && (p.page ?? 1) === 1) {
      syncFromUrl();
    }
  }, [searchParams, syncFromUrl]);

  const params = paramsFromSearch(searchParams);

  const setParams = useCallback(
    (updates: Partial<SecretsParams>) => {
      const next = { ...params, ...updates };

      const filterChanged =
        ("provider" in updates && updates.provider !== params.provider) ||
        ("search" in updates && updates.search !== params.search) ||
        ("sortBy" in updates && updates.sortBy !== params.sortBy) ||
        ("order" in updates && updates.order !== params.order) ||
        ("limit" in updates && updates.limit !== params.limit);
      if (filterChanged) {
        next.cursor = undefined;
        next.page = 1;
        syncFromUrl();
      }
      setSearchParams(searchFromParams(next), { replace: !filterChanged });
    },
    [params, setSearchParams, syncFromUrl],
  );

  const handleGoNext = useCallback(
    (nextCursor: string) => {
      const next: SecretsParams = {
        ...params,
        cursor: nextCursor,
        page: (params.page ?? 1) + 1,
      };
      goNext(nextCursor);
      setSearchParams(searchFromParams(next));
    },
    [params, goNext, setSearchParams],
  );

  const handleGoPrev = useCallback(() => {
    goPrev();
    const prevPage = Math.max(1, (params.page ?? 1) - 1);

    const prevCursor = useFilterStore.getState().params.cursor;
    const next: SecretsParams = {
      ...params,
      cursor: prevCursor,
      page: prevPage,
    };
    setSearchParams(searchFromParams(next));
  }, [params, goPrev, setSearchParams]);

  const handleReset = useCallback(() => {
    resetFilters();
    setSearchParams(new URLSearchParams());
  }, [resetFilters, setSearchParams]);

  const secretsQuery = useSecrets(params);
  const statsQuery = useStats();
  const providersQuery = useProviders();
  const invalidateSecrets = useInvalidateSecrets();
  const invalidateStats = useInvalidateStats();

  const providers: SelectOption[] = [
    { value: "", label: "All providers" },
    ...(providersQuery.data ?? []).map((p) => ({ value: p, label: p })),
  ];

  const handleRefresh = () => {
    invalidateSecrets();
    invalidateStats();
    toast.info("Refreshed");
  };

  const secrets = secretsQuery.data?.data ?? [];
  const meta = secretsQuery.data?.meta;
  const isLoading = secretsQuery.isLoading;

  const currentPage = params.page ?? 1;
  const totalPages = meta?.totalPages ?? null;
  const hasPrev = cursorHistory.length > 0;
  const hasNext = !!meta?.nextCursor;

  return (
    <div className="min-h-screen">
      {}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-5 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight leading-tight">
                Secret Scanner
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Real-time AI API key exposure monitor across public GitHub
                repositories
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={secretsQuery.isFetching}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${secretsQuery.isFetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-5">
        {}
        <StatsBar stats={statsQuery.data} loading={statsQuery.isLoading} />

        {}
        <ScanLiveFeed />

        {}
        <div className="flex flex-col gap-2.5">
          <div className="w-full">
            <Input
              icon={<Search className="h-3.5 w-3.5" />}
              placeholder="Search repos, files, providers…"
              value={params.search ?? ""}
              onChange={(e) =>
                setParams({ search: e.target.value || undefined })
              }
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[130px]">
              <Select
                value={params.provider ?? ""}
                onChange={(v) => setParams({ provider: v || undefined })}
                options={providers}
                placeholder="All providers"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <Select
                value={params.sortBy ?? "discoveredAt"}
                onChange={(v) =>
                  setParams({
                    sortBy: v as "discoveredAt" | "entropy" | "stars",
                  })
                }
                options={SORT_OPTIONS}
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <Select
                value={String(params.limit ?? 20)}
                onChange={(v) => setParams({ limit: Number(v) })}
                options={LIMIT_OPTIONS}
              />
            </div>
            {(params.provider || params.search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="shrink-0"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {}
        <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-3">
          <div className="flex flex-wrap items-center gap-2">
            {meta && (
              <span className="text-xs text-muted-foreground">
                {meta.total.toLocaleString()} secrets found
              </span>
            )}
            {params.provider && (
              <Badge variant="secondary">{params.provider}</Badge>
            )}
            {secretsQuery.isFetching && !isLoading && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" /> updating
              </span>
            )}
          </div>
          {meta && (
            <span className="text-xs text-muted-foreground tabular-nums">
              Page {currentPage}
              {totalPages != null ? ` of ${totalPages}` : ""}
            </span>
          )}
        </div>

        {}
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-5 space-y-3"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : secrets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
              <ShieldOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-medium">No secrets found</h3>
            <p className="max-w-xs text-xs text-muted-foreground">
              {params.search || params.provider
                ? "Try adjusting your filters."
                : "The scanner is running — check back soon."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {secrets.map((secret) => (
              <SecretCard key={secret._id} secret={secret} />
            ))}
          </div>
        )}

        {}
        {(hasPrev || hasNext) && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev || secretsQuery.isFetching}
              onClick={handleGoPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            <span className="text-xs text-muted-foreground tabular-nums">
              {meta ? `${meta.total.toLocaleString()} total · ` : ""}
              page {currentPage}
              {totalPages != null ? ` of ${totalPages}` : ""}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext || secretsQuery.isFetching}
              onClick={() => meta?.nextCursor && handleGoNext(meta.nextCursor)}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
