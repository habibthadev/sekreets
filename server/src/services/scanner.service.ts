import { searchGithubCode, getFileContent, delay } from "../lib/github.js";
import { scanContent } from "../lib/patterns.js";
import { SecretModel, maskSecret } from "../models/secret.model.js";
import { logger } from "../lib/logger.js";
import { env } from "../lib/env.js";
import { AI_PATTERNS } from "../lib/patterns.js";
import { emitScanEvent } from "../lib/scan-emitter.js";
import type { GithubCodeItem } from "../lib/github.js";

const DISTINCTIVE_PREFIX_QUERIES = [
  '"sk-proj-"',
  '"sk-ant-"',
  '"AIza"',
  '"hf_"',
  '"pplx-"',
  '"r8_"',
  '"gsk_"',
  '"xai-"',
  '"nvapi-"',
  '"sk-or-"',
  '"fw_"',
  '"AKIA"',
];

const ENV_VAR_QUERIES = [
  '"OPENAI_API_KEY"',
  '"ANTHROPIC_API_KEY"',
  '"GROQ_API_KEY"',
  '"MISTRAL_API_KEY"',
  '"COHERE_API_KEY"',
  '"STABILITY_API_KEY"',
  '"TOGETHER_API_KEY"',
  '"ELEVENLABS_API_KEY"',
  '"DEEPSEEK_API_KEY"',
  '"FIREWORKS_API_KEY"',
  '"CEREBRAS_API_KEY"',
  '"AI21_API_KEY"',
  '"ASSEMBLYAI_API_KEY"',
  '"DEEPINFRA_API_KEY"',
  '"AZURE_OPENAI_API_KEY"',
  '"XI_API_KEY"',
  '"CO_API_KEY"',
  '"VOYAGE_API_KEY"',
];

const TARGETED_CONFIG_QUERIES = [
  'filename:mcp.json "sk-"',
  'filename:claude_desktop_config.json "sk-"',
  'filename:settings.json path:.claude "sk-"',
  'filename:config.json path:.continue "sk-"',
  'filename:config.json path:.codeium "sk-"',
  'filename:.npmrc "_authToken"',
  'filename:.yarnrc.yml "npmAuthToken"',
  'filename:docker-compose.yml "API_KEY"',
  'filename:docker-compose.yaml "API_KEY"',
  'filename:wrangler.toml "API_KEY"',
  'filename:render.yaml "API_KEY"',
  'filename:fly.toml "API_KEY"',
  'filename:netlify.toml "API_KEY"',
  'filename:railway.toml "API_KEY"',
  'extension:yml path:.github/workflows "API_KEY"',
  'filename:.gitlab-ci.yml "API_KEY"',
  'filename:config.yml path:.circleci "API_KEY"',
  'filename:Jenkinsfile "API_KEY"',
  'filename:appsettings.json "ApiKey"',
  'filename:secrets.yaml "api_key"',
  'filename:secrets.yml "api_key"',
  'filename:Dockerfile "API_KEY"',
  'extension:properties "api.key"',
  'extension:ini "api_key"',
  'extension:conf "api_key"',
  'extension:cfg "api_key"',
  'extension:xml "apiKey"',
  'filename:.env.local "sk-"',
  'filename:.env.production "sk-"',
  'filename:.env.staging "sk-"',
  'filename:.env.development "sk-"',
  'filename:.env.test "sk-"',
  'filename:next.config.js "sk-"',
  'filename:next.config.ts "sk-"',
  'filename:nuxt.config.ts "sk-"',
  'filename:vite.config.ts "sk-"',
  'filename:astro.config.mjs "sk-"',
  'filename:svelte.config.js "sk-"',
  'filename:openai.json "sk-"',
  'filename:gemini.json "AIza"',
  'filename:vercel.json "sk-"',
  'filename:.pnpmfile.cjs "sk-"',
];

const SCAN_QUERIES = [
  ...DISTINCTIVE_PREFIX_QUERIES,
  ...ENV_VAR_QUERIES,
  ...TARGETED_CONFIG_QUERIES,
];

let _queryOffset = 0;

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

  const batchSize = env.MAX_RESULTS_PER_SCAN;
  const start = _queryOffset % effectiveQueries.length;
  const batch: string[] = [];
  for (let i = 0; i < batchSize; i++) {
    batch.push(effectiveQueries[(start + i) % effectiveQueries.length]);
  }
  _queryOffset = (start + batchSize) % effectiveQueries.length;

  let totalNew = 0;
  let pagesScanned = 0;

  try {
    for (const query of batch) {
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
