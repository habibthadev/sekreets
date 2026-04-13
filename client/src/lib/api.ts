import axios from "axios";
import { z } from "zod";

export const API_BASE = import.meta.env.VITE_API_URL ?? "/api";
export const SSE_URL = `${API_BASE}/scan/stream`;

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.error ?? err.message ?? "Request failed";
    return Promise.reject(new Error(message));
  },
);

export const SecretSchema = z.object({
  _id: z.string(),
  provider: z.string(),
  patternName: z.string(),
  description: z.string(),
  maskedValue: z.string(),
  entropy: z.number(),
  repoFullName: z.string(),
  repoUrl: z.string(),
  repoOwner: z.string(),
  repoOwnerAvatar: z.string(),
  filePath: z.string(),
  fileUrl: z.string(),
  lineNumber: z.number().nullable(),
  fragment: z.string().nullable(),
  stars: z.number(),
  discoveredAt: z.string(),
  isValid: z.boolean(),
});

export type Secret = z.infer<typeof SecretSchema>;

export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number().nullable(),
  limit: z.number(),
  totalPages: z.number().nullable(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
  nextCursor: z.string().nullable(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const StatsSchema = z.object({
  total: z.number(),
  last24h: z.number(),
  byProvider: z.array(z.object({ _id: z.string(), count: z.number() })),
  providers: z.array(z.string()),
});

export type Stats = z.infer<typeof StatsSchema>;

export interface SecretsParams {
  page?: number;
  limit?: number;
  cursor?: string;
  provider?: string;
  repo?: string;
  search?: string;
  sortBy?: "discoveredAt" | "entropy" | "stars";
  order?: "asc" | "desc";
}

export const fetchSecrets = async (params: SecretsParams) => {
  const { data } = await apiClient.get<{
    success: boolean;
    data: Secret[];
    meta: PaginationMeta;
  }>("/secrets", { params });
  return data;
};

export const fetchStats = async (): Promise<Stats> => {
  const { data } = await apiClient.get<{ success: boolean; data: Stats }>(
    "/secrets/stats",
  );
  return data.data;
};

export const fetchProviders = async (): Promise<string[]> => {
  const { data } = await apiClient.get<{ success: boolean; data: string[] }>(
    "/providers",
  );
  return data.data;
};

export const triggerScan = async (provider?: string): Promise<void> => {
  await apiClient.post("/scan", { provider });
};

export const LeaderboardEntrySchema = z.object({
  login: z.string(),
  avatar: z.string(),
  totalSecrets: z.number(),
  repoCount: z.number(),
  providerCount: z.number(),
  providers: z.array(z.string()),
  latestExposure: z.string(),
  maxStars: z.number(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export interface LeaderboardParams {
  limit?: number;
  provider?: string;
}

export const fetchLeaderboard = async (
  params?: LeaderboardParams,
): Promise<LeaderboardEntry[]> => {
  const { data } = await apiClient.get<{
    success: boolean;
    data: LeaderboardEntry[];
  }>("/leaderboard", { params });
  return data.data;
};
