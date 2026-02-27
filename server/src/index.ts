import "dotenv/config";
import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { connectDB } from "./db/connection.js";
import { logger } from "./lib/logger.js";
import { env } from "./lib/env.js";
import { startAutoScan } from "./services/scanner.service.js";

const app = createApp();

const bootstrap = async (): Promise<void> => {
  await connectDB();

  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    logger.info(`Sekreets server running on http://localhost:${info.port}`);
    logger.info(`Swagger UI: http://localhost:${info.port}/ui`);
    startAutoScan();
  });
};

bootstrap().catch((err) => {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
});

export default app;
