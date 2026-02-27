import { describe, it, expect, vi, beforeEach } from "vitest";
import { createApp } from "../app.js";

vi.mock("../models/secret.model.js", () => ({
  SecretModel: {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([]),
    }),
    estimatedDocumentCount: vi.fn().mockResolvedValue(0),
    countDocuments: vi.fn().mockImplementation(() => {
      const p = Promise.resolve(0) as Promise<number> & {
        limit: () => Promise<number>;
      };
      p.limit = () => Promise.resolve(0);
      return p;
    }),
    aggregate: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue(null),
    }),
  },
  maskSecret: vi.fn((v: string) => v),
}));

vi.mock("../services/scanner.service.js", () => ({
  runScan: vi.fn().mockResolvedValue({ newSecrets: 0 }),
}));

describe("API Routes", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it("GET /health returns 200", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  it("GET /api/secrets returns 200", async () => {
    const res = await app.request("/api/secrets");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });

  it("GET /api/providers returns providers list", async () => {
    const res = await app.request("/api/providers");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean; data: string[] };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("GET /api/secrets/stats returns stats", async () => {
    const SecretModel = (await import("../models/secret.model.js")).SecretModel;
    (SecretModel.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const res = await app.request("/api/secrets/stats");
    expect(res.status).toBe(200);
  });

  it("GET /api/leaderboard returns leaderboard", async () => {
    const SecretModel = (await import("../models/secret.model.js")).SecretModel;
    (SecretModel.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const res = await app.request("/api/leaderboard");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean; data: unknown[] };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("GET /api/leaderboard supports provider filter", async () => {
    const res = await app.request("/api/leaderboard?provider=OpenAI&limit=5");
    expect(res.status).toBe(200);
  });

  it("POST /api/scan returns 202", async () => {
    const res = await app.request("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(202);
  });

  it("GET /openapi.json returns spec", async () => {
    const res = await app.request("/openapi.json");
    expect(res.status).toBe(200);
  });

  it("GET /unknown returns 404", async () => {
    const res = await app.request("/unknown-endpoint-xyz");
    expect(res.status).toBe(404);
  });
});
