import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/sekreets"),
  GITHUB_TOKEN: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  SCAN_INTERVAL_MINUTES: z.coerce.number().default(10),
  MAX_RESULTS_PER_SCAN: z.coerce.number().default(5),
  RATE_LIMIT_DELAY_MS: z.coerce.number().default(1200),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
