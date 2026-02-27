import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { streamSSE } from "hono/streaming";
import type { Types, PipelineStage } from "mongoose";
import { SecretModel } from "../models/secret.model.js";
import { runScan } from "../services/scanner.service.js";
import { UNIQUE_PROVIDERS } from "../lib/patterns.js";
import { scanEmitter } from "../lib/scan-emitter.js";
import { logger } from "../lib/logger.js";
import type { ScanEvent } from "../lib/scan-emitter.js";

const secretsQuerySchema = z.object({
  cursor: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  provider: z.string().optional(),
  repo: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["discoveredAt", "entropy", "stars"]).default("discoveredAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  provider: z.string().optional(),
});

const scanBodySchema = z.object({
  provider: z.string().optional(),
});

export const apiRouter = new Hono()

  .get("/secrets", zValidator("query", secretsQuerySchema), async (c) => {
    const { cursor, page, limit, provider, repo, search, sortBy, order } =
      c.req.valid("query");

    const sortOrder = order === "asc" ? 1 : -1;
    const sortDir = order === "asc" ? "$gt" : "$lt";

    const baseFilter: Record<string, unknown> = {};
    if (provider) baseFilter["provider"] = provider;
    if (repo) baseFilter["repoFullName"] = { $regex: repo, $options: "i" };
    if (search) {
      if (!repo) {
        baseFilter["$text"] = { $search: search };
      } else {
        baseFilter["$or"] = [
          { repoFullName: { $regex: search, $options: "i" } },
          { filePath: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    }

    let decodedCursor: { id: string; v: unknown } | null = null;
    if (cursor) {
      try {
        decodedCursor = JSON.parse(
          Buffer.from(cursor, "base64url").toString("utf8"),
        ) as { id: string; v: unknown };
      } catch {
        return c.json({ success: false, error: "Invalid cursor" }, 400);
      }
    }

    const queryFilter = decodedCursor
      ? {
          ...baseFilter,
          $or: [
            { [sortBy]: { [sortDir]: decodedCursor.v } },
            {
              [sortBy]: decodedCursor.v,
              _id: { [sortDir]: decodedCursor.id },
            },
          ],
        }
      : baseFilter;

    const countFilter = Object.keys(baseFilter).length === 0;
    const totalPromise = countFilter
      ? SecretModel.estimatedDocumentCount()
      : SecretModel.countDocuments(baseFilter).limit(10_000);

    const skip = decodedCursor ? 0 : (page - 1) * limit;

    const [data, total] = await Promise.all([
      SecretModel.find(queryFilter)
        .sort({ [sortBy]: sortOrder, _id: sortOrder })
        .skip(skip)
        .limit(limit + 1)
        .select("-value")
        .lean(),
      totalPromise,
    ]);

    const hasNext = data.length > limit;
    const items = hasNext ? data.slice(0, limit) : data;
    const lastItem = items.at(-1) as
      | (Record<string, unknown> & { _id: Types.ObjectId })
      | undefined;

    const nextCursor =
      hasNext && lastItem
        ? Buffer.from(
            JSON.stringify({
              id: String(lastItem._id),
              v: lastItem[sortBy],
            }),
          ).toString("base64url")
        : null;

    const hasPrev = decodedCursor ? true : page > 1;
    const totalPages = Math.ceil(total / limit);

    return c.json({
      success: true,
      data: items,
      meta: {
        total,
        page: decodedCursor ? null : page,
        limit,
        totalPages: decodedCursor ? null : totalPages,
        hasNext,
        hasPrev,
        nextCursor,
      },
    });
  })

  .get("/secrets/stats", async (c) => {
    const [total, byProvider, recentCount] = await Promise.all([
      SecretModel.countDocuments(),
      SecretModel.aggregate([
        { $group: { _id: "$provider", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      SecretModel.countDocuments({
        discoveredAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    return c.json({
      success: true,
      data: {
        total,
        last24h: recentCount,
        byProvider,
        providers: UNIQUE_PROVIDERS,
      },
    });
  })

  .get(
    "/leaderboard",
    zValidator("query", leaderboardQuerySchema),
    async (c) => {
      const { limit, provider } = c.req.valid("query");

      const matchStage = provider ? { $match: { provider } } : null;

      const ownerPipeline: PipelineStage[] = [
        ...(matchStage ? [matchStage as PipelineStage] : []),
        {
          $group: {
            _id: "$repoOwner",
            avatar: { $first: "$repoOwnerAvatar" },
            totalSecrets: { $sum: 1 },
            uniqueRepos: { $addToSet: "$repoFullName" },
            providers: { $addToSet: "$provider" },
            latestExposure: { $max: "$discoveredAt" },
            maxStars: { $max: "$stars" },
          },
        },
        {
          $project: {
            _id: 0,
            login: "$_id",
            avatar: 1,
            totalSecrets: 1,
            repoCount: { $size: "$uniqueRepos" },
            providerCount: { $size: "$providers" },
            providers: 1,
            latestExposure: 1,
            maxStars: 1,
          },
        },
        { $sort: { totalSecrets: -1 as const, latestExposure: -1 as const } },
        { $limit: limit },
      ];

      const entries = await SecretModel.aggregate(ownerPipeline);

      return c.json({ success: true, data: entries });
    },
  )

  .get("/secrets/:id", async (c) => {
    const id = c.req.param("id");
    const secret = await SecretModel.findById(id).select("-value").lean();
    if (!secret) return c.json({ success: false, error: "Not found" }, 404);
    return c.json({ success: true, data: secret });
  })

  .post("/scan", zValidator("json", scanBodySchema), async (c) => {
    const { provider } = c.req.valid("json");
    logger.info("Manual scan triggered", { provider });
    runScan(provider).catch((err) =>
      logger.error("Scan error", { error: err }),
    );
    return c.json({ success: true, message: "Scan started" }, 202);
  })

  .get("/providers", (c) => {
    return c.json({ success: true, data: UNIQUE_PROVIDERS });
  })

  .get("/scan/stream", (c) => {
    return streamSSE(c, async (stream) => {
      await stream.writeSSE({ event: "connected", data: '{"ok":true}' });

      const listener = async (event: ScanEvent) => {
        try {
          await stream.writeSSE({
            event: event.type,
            data: JSON.stringify(event),
          });
        } catch {}
      };

      scanEmitter.on("scan", listener);

      const heartbeat = setInterval(async () => {
        try {
          await stream.writeSSE({ event: "ping", data: String(Date.now()) });
        } catch {
          clearInterval(heartbeat);
        }
      }, 15_000);

      stream.onAbort(() => {
        scanEmitter.off("scan", listener);
        clearInterval(heartbeat);
      });

      await new Promise<void>((resolve) => {
        stream.onAbort(resolve);
      });
    });
  });
