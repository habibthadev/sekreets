import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSecrets, type SecretsParams } from "@/lib/api";

export const secretsKeys = {
  all: ["secrets"] as const,
  list: (params: SecretsParams) => ["secrets", params] as const,
};

export const useSecrets = (params: SecretsParams) =>
  useQuery({
    queryKey: secretsKeys.list(params),
    queryFn: () => fetchSecrets(params),
    refetchInterval: 30_000,
  });

export const useInvalidateSecrets = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: secretsKeys.all });
};
