import { describe, it, expect } from "vitest";
import {
  scanContent,
  computeEntropy,
  AI_PATTERNS,
  UNIQUE_PROVIDERS,
} from "../lib/patterns.js";

describe("computeEntropy", () => {
  it("returns 0 for single character string", () => {
    expect(computeEntropy("aaaa")).toBe(0);
  });

  it("returns high entropy for random-looking string", () => {
    expect(
      computeEntropy("sk-abc123XYZ456defGHI789jklMNO012pqrSTU345vwxYZ6"),
    ).toBeGreaterThan(3);
  });
});

describe("AI_PATTERNS", () => {
  it("has at least 20 patterns", () => {
    expect(AI_PATTERNS.length).toBeGreaterThanOrEqual(20);
  });

  it("every pattern has required fields", () => {
    for (const p of AI_PATTERNS) {
      expect(p.provider).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.regex).toBeInstanceOf(RegExp);
      expect(p.description).toBeTruthy();
    }
  });
});

describe("UNIQUE_PROVIDERS", () => {
  it("contains known providers", () => {
    expect(UNIQUE_PROVIDERS).toContain("OpenAI");
    expect(UNIQUE_PROVIDERS).toContain("Anthropic");
    expect(UNIQUE_PROVIDERS).toContain("Google");
    expect(UNIQUE_PROVIDERS).toContain("Groq");
  });
});

describe("scanContent", () => {
  it("detects OpenAI key", () => {
    const content = `OPENAI_API_KEY=sk-abcdefghijklmnopqrstuvwxyzABCDEF012345678901234567`;
    const matches = scanContent(content);
    expect(matches.some((m) => m.provider === "OpenAI")).toBe(true);
  });

  it("detects Groq key", () => {
    const content = `GROQ_API_KEY=gsk_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW`;
    const matches = scanContent(content);
    expect(matches.some((m) => m.provider === "Groq")).toBe(true);
  });

  it("detects Hugging Face token", () => {
    const content = `HF_TOKEN=hf_abcdefghijklmnopqrstuvwxyzABCDEFGHIJ`;
    const matches = scanContent(content);
    expect(matches.some((m) => m.provider === "HuggingFace")).toBe(true);
  });

  it("detects xAI key", () => {
    const content = `XAI_API_KEY=xai-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV`;
    const matches = scanContent(content);
    expect(matches.some((m) => m.provider === "xAI")).toBe(true);
  });

  it("detects NVIDIA key", () => {
    const content = `NVIDIA_API_KEY=nvapi-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678`;
    const matches = scanContent(content);
    expect(matches.some((m) => m.provider === "Nvidia")).toBe(true);
  });

  it("deduplicates same value", () => {
    const key = "sk-abcdefghijklmnopqrstuvwxyzABCDEF012345678901234567";
    const content = `KEY=${key}\nKEY2=${key}`;
    const matches = scanContent(content);
    const openaiMatches = matches.filter((m) => m.provider === "OpenAI");
    expect(openaiMatches.length).toBe(1);
  });

  it("ignores low-entropy values", () => {
    const content = `sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
    const matches = scanContent(content);
    expect(matches.length).toBe(0);
  });

  it("returns empty for clean content", () => {
    const content = `DATABASE_URL=postgresql://user:pass@localhost/db\nNODE_ENV=production`;
    const matches = scanContent(content);
    expect(matches.length).toBe(0);
  });
});
