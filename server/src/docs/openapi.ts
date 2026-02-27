export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Sekreets API",
    description:
      "Real-time GitHub AI API key scanner. Scans public GitHub repositories for exposed AI provider API keys.",
    version: "1.0.0",
    contact: { name: "Sekreets" },
  },
  servers: [{ url: "http://localhost:3001", description: "Local development" }],
  tags: [
    { name: "Secrets", description: "Discovered secrets endpoints" },
    { name: "Scan", description: "Scan management" },
    { name: "Leaderboard", description: "Hall of shame leaderboard" },
    { name: "Providers", description: "Supported AI providers" },
  ],
  paths: {
    "/api/secrets": {
      get: {
        tags: ["Secrets"],
        summary: "List all discovered secrets",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          { name: "provider", in: "query", schema: { type: "string" } },
          { name: "repo", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["discoveredAt", "entropy", "stars"],
              default: "discoveredAt",
            },
          },
          {
            name: "order",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
          },
        ],
        responses: {
          "200": {
            description: "List of secrets",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Secret" },
                    },
                    meta: { $ref: "#/components/schemas/PaginationMeta" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/secrets/stats": {
      get: {
        tags: ["Secrets"],
        summary: "Get statistics about discovered secrets",
        responses: {
          "200": {
            description: "Statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Stats" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/secrets/{id}": {
      get: {
        tags: ["Secrets"],
        summary: "Get a specific secret by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Secret detail" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/scan": {
      post: {
        tags: ["Scan"],
        summary: "Trigger a new scan",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { provider: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "202": { description: "Scan started" },
        },
      },
    },
    "/api/leaderboard": {
      get: {
        tags: ["Leaderboard"],
        summary: "Hall of shame — developers with the most exposed secrets",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          { name: "provider", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Leaderboard entries",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/LeaderboardEntry" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/providers": {
      get: {
        tags: ["Providers"],
        summary: "List all supported AI providers",
        responses: { "200": { description: "Providers list" } },
      },
    },
  },
  components: {
    schemas: {
      Secret: {
        type: "object",
        properties: {
          _id: { type: "string" },
          provider: { type: "string" },
          patternName: { type: "string" },
          description: { type: "string" },
          maskedValue: { type: "string" },
          entropy: { type: "number" },
          repoFullName: { type: "string" },
          repoUrl: { type: "string" },
          repoOwner: { type: "string" },
          repoOwnerAvatar: { type: "string" },
          filePath: { type: "string" },
          fileUrl: { type: "string" },
          lineNumber: { type: "integer", nullable: true },
          fragment: { type: "string", nullable: true },
          stars: { type: "integer" },
          discoveredAt: { type: "string", format: "date-time" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          total: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
          totalPages: { type: "integer" },
          hasNext: { type: "boolean" },
          hasPrev: { type: "boolean" },
        },
      },
      Stats: {
        type: "object",
        properties: {
          total: { type: "integer" },
          last24h: { type: "integer" },
          byProvider: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                count: { type: "integer" },
              },
            },
          },
          providers: { type: "array", items: { type: "string" } },
        },
      },
      LeaderboardEntry: {
        type: "object",
        properties: {
          login: { type: "string" },
          avatar: { type: "string" },
          totalSecrets: { type: "integer" },
          repoCount: { type: "integer" },
          providerCount: { type: "integer" },
          providers: { type: "array", items: { type: "string" } },
          latestExposure: { type: "string", format: "date-time" },
          maxStars: { type: "integer" },
        },
      },
    },
  },
};
