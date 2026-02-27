import { KeyRound, Activity, Clock, TrendingUp } from "lucide-react";
import type { Stats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface StatsBarProps {
  stats?: Stats;
  loading?: boolean;
}

export const StatsBar = ({ stats, loading }: StatsBarProps) => {
  const items = [
    {
      icon: KeyRound,
      label: "Total secrets",
      value: stats?.total.toLocaleString() ?? "0",
    },
    {
      icon: Clock,
      label: "Last 24 hours",
      value: stats?.last24h.toLocaleString() ?? "0",
    },
    {
      icon: Activity,
      label: "Providers tracked",
      value: String(stats?.providers.length ?? 0),
    },
    {
      icon: TrendingUp,
      label: "Top provider",
      value: stats?.byProvider[0]?._id ?? "—",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-3 sm:p-4"
          >
            <div className="flex items-center gap-1.5 text-label text-muted-foreground mb-2">
              <Icon className="h-3 w-3 shrink-0" />
              {label}
            </div>
            <div className="text-numeric text-lg sm:text-xl">{value}</div>
          </div>
        ))}
      </div>

      {stats && stats.byProvider.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <p className="text-label text-muted-foreground mb-3">By provider</p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {stats.byProvider.slice(0, 10).map(({ _id, count }) => {
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={_id} className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <span className="truncate font-medium tracking-tight min-w-0">
                      {_id}
                    </span>
                    <span className="font-mono-data text-muted-foreground shrink-0 tabular-nums">
                      {count}
                    </span>
                  </div>
                  <Progress value={pct} max={100} className="h-1" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
