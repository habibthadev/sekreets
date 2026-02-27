import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard, type LeaderboardParams } from "@/lib/api";

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: (params: LeaderboardParams) => ["leaderboard", params] as const,
};

export const useLeaderboard = (params: LeaderboardParams = {}) =>
  useQuery({
    queryKey: leaderboardKeys.list({
      provider: params.provider || undefined,
      limit: params.limit,
    }),
    queryFn: () =>
      fetchLeaderboard({
        provider: params.provider || undefined,
        limit: params.limit,
      }),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
