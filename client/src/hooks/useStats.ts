import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";

export const statsKeys = {
  all: ["stats"] as const,
};

export const useStats = () =>
  useQuery({
    queryKey: statsKeys.all,
    queryFn: fetchStats,
    refetchInterval: 30_000,
  });

export const useInvalidateStats = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: statsKeys.all });
};
