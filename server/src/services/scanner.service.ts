import { searchGithubCode, getFileContent, delay } from "../lib/github.js";
import { scanContent } from "../lib/patterns.js";
import { SecretModel, maskSecret } from "../models/secret.model.js";
import { logger } from "../lib/logger.js";
import { env } from "../lib/env.js";
import { AI_PATTERNS } from "../lib/patterns.js";
import { emitScanEvent } from "../lib/scan-emitter.js";
import type { GithubCodeItem } from "../lib/github.js";

const SCAN_QUERIES = [
  'filename:.env "sk-"',
  'filename:.env "OPENAI_API_KEY"',
  'filename:.env "ANTHROPIC_API_KEY"',
  'filename:.env "AIza"',
  'filename:.env "hf_"',
  'filename:.env "GROQ_API_KEY"',
  'filename:.env "pplx-"',
  'filename:.env "r8_"',
  'filename:.env "gsk_"',
  'filename:.env "xai-"',
  'filename:.env "nvapi-"',
  'filename:.env "sk-or-"',
  'filename:.env "MISTRAL_API_KEY"',
  'filename:.env "COHERE_API_KEY"',
  'filename:.env "STABILITY_API_KEY"',
  'filename:.env "TOGETHER_API_KEY"',
  'filename:.env "ELEVENLABS_API_KEY"',
  'filename:.env "DEEPSEEK_API_KEY"',
  'filename:.env "FIREWORKS_API_KEY"',
  'filename:.env "CEREBRAS_API_KEY"',
];

const extractLineNumber = (content: string, value: string): number | null => {
  const lines = content.split("\n");
  const idx = lines.findIndex((line) => line.includes(value));
  return idx >= 0 ? idx + 1 : null;
};

const processItem = async (
  item: GithubCodeItem,
  query: string,
): Promise<number> => {
  const [owner, repo] = item.repository.full_name.split("/");

  emitScanEvent({
    type: "scanning",
    repo: item.repository.full_name,
    file: item.path,
    query,
  });

  let content: string;

  try {
    content = await getFileContent(owner, repo, item.path);
  } catch {
    return 0;
  }

  const matches = scanContent(content);
  if (matches.length === 0) return 0;

  let inserted = 0;
  for (const match of matches) {
    const existing = await SecretModel.findOne({
      repoFullName: item.repository.full_name,
      filePath: item.path,
      value: match.value,
    });
    if (existing) continue;

    const lineNumber = extractLineNumber(content, match.value);
    const fragment = item.text_matches?.[0]?.fragment ?? null;

    await SecretModel.create({
      provider: match.provider,
      patternName: match.name,
      description: match.description,
      value: match.value,
      maskedValue: maskSecret(match.value),
      entropy: match.entropy,
      repoFullName: item.repository.full_name,
      repoUrl: item.repository.html_url,
      repoOwner: item.repository.owner.login,
      repoOwnerAvatar: item.repository.owner.avatar_url,
      filePath: item.path,
      fileUrl: item.html_url,
      lineNumber,
      fragment,
      stars: item.repository.stargazers_count ?? 0,
      discoveredAt: new Date(),
      isValid: true,
    });

    emitScanEvent({
      type: "found",
      repo: item.repository.full_name,
      repoUrl: item.repository.html_url,
      file: item.path,
      fileUrl: item.html_url,
      provider: match.provider,
      patternName: match.name,
      maskedValue: maskSecret(match.value),
      entropy: match.entropy,
      lineNumber,
    });

    inserted++;
  }

  return inserted;
};

let _autoScanRunning = false;

export const startAutoScan = (): void => {
  if (_autoScanRunning) return;
  _autoScanRunning = true;

  const intervalMs = env.SCAN_INTERVAL_MINUTES * 60 * 1000;

  const tick = async () => {
    try {
      logger.info("Auto-scan tick starting");
      await runScan();
    } catch (err) {
      logger.error("Auto-scan tick failed", { error: err });
    } finally {
      setTimeout(tick, intervalMs);
    }
  };

  setTimeout(tick, 5_000);
  logger.info(
    `Auto-scan scheduled — interval: ${env.SCAN_INTERVAL_MINUTES} min`,
  );
};

export const runScan = async (
  overrideProvider?: string,
): Promise<{ newSecrets: number }> => {
  const queries = overrideProvider
    ? SCAN_QUERIES.filter((q) => {
        const providerPatterns = AI_PATTERNS.filter(
          (p) => p.provider.toLowerCase() === overrideProvider.toLowerCase(),
        );
        return providerPatterns.some(
          (p) =>
            q.toLowerCase().includes(p.provider.toLowerCase()) ||
            q.toLowerCase().includes(p.name.toLowerCase().replace(/_/g, "")),
        );
      })
    : SCAN_QUERIES;

  const effectiveQueries = queries.length > 0 ? queries : SCAN_QUERIES;

  let totalNew = 0;
  let pagesScanned = 0;

  try {
    for (const query of effectiveQueries.slice(0, env.MAX_RESULTS_PER_SCAN)) {
      try {
        const result = await searchGithubCode(query, 1, 30);
        pagesScanned++;

        for (const item of result.items) {
          const n = await processItem(item, query);
          totalNew += n;
          await delay(env.RATE_LIMIT_DELAY_MS);
        }

        await delay(env.RATE_LIMIT_DELAY_MS * 2);
      } catch (err) {
        logger.warn(`Scan query failed: ${query}`, { error: err });
      }
    }

    emitScanEvent({ type: "done", total: totalNew });
    logger.info(
      `Scan completed. New secrets: ${totalNew}. Pages: ${pagesScanned}`,
    );
    return { newSecrets: totalNew };
  } catch (err) {
    emitScanEvent({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
};
