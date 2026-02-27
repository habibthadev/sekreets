import axios from "axios";
import { env } from "./env.js";
import { logger } from "./logger.js";

const BASE = "https://api.github.com";

const githubClient = axios.create({
  baseURL: BASE,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` }
      : {}),
  },
  timeout: 15000,
});

githubClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url ?? "";
    logger.warn(`GitHub API error ${status} on ${url}`);
    return Promise.reject(err);
  },
);

export interface GithubCodeItem {
  name: string;
  path: string;
  sha: string;
  html_url: string;
  repository: {
    id: number;
    full_name: string;
    html_url: string;
    owner: { login: string; avatar_url: string };
    stargazers_count?: number;
  };
  text_matches?: Array<{ fragment: string; matches: Array<{ text: string }> }>;
}

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubCodeItem[];
}

export interface GithubFileContent {
  content: string;
  encoding: string;
  size: number;
  html_url: string;
}

export const searchGithubCode = async (
  query: string,
  page = 1,
  perPage = 30,
): Promise<GithubSearchResponse> => {
  const res = await githubClient.get<GithubSearchResponse>("/search/code", {
    params: { q: query, per_page: perPage, page },
    headers: { Accept: "application/vnd.github.v3.text-match+json" },
  });
  return res.data;
};

export const getFileContent = async (
  owner: string,
  repo: string,
  path: string,
): Promise<string> => {
  const res = await githubClient.get<GithubFileContent>(
    `/repos/${owner}/${repo}/contents/${path}`,
  );
  const { content, encoding } = res.data;
  if (encoding === "base64") {
    return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8");
  }
  return content;
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getRateLimit = async (): Promise<{
  remaining: number;
  reset: number;
  limit: number;
}> => {
  const res = await githubClient.get<{
    resources: { search: { remaining: number; reset: number; limit: number } };
  }>("/rate_limit");
  return res.data.resources.search;
};
