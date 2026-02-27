import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { swaggerUI } from "@hono/swagger-ui";
import { apiRouter } from "./routes/api.routes.js";
import { env } from "./lib/env.js";
import { openApiSpec } from "./docs/openapi.js";

export const createApp = (): Hono => {
  const app = new Hono();

  app.use("*", honoLogger());
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin: env.CORS_ORIGIN,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.get("/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() }),
  );

  app.get("/openapi.json", (c) => c.json(openApiSpec));
  app.get("/ui", swaggerUI({ url: "/openapi.json" }));

  app.route("/api", apiRouter);

  app.onError((err, c) => {
    return c.json({ success: false, error: err.message }, 500);
  });

  app.notFound((c) => c.json({ success: false, error: "Not found" }, 404));

  return app;
};
