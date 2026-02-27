import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/api";

export const providersKeys = {
  all: ["providers"] as const,
};

export const useProviders = () =>
  useQuery({
    queryKey: providersKeys.all,
    queryFn: fetchProviders,
    staleTime: Infinity,
  });
