# Sekreets

Real-time GitHub AI API key scanner. Discovers exposed AI API keys in public GitHub repositories with direct links to the exact repo, file, and line number.

## Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React 18, TypeScript, Tailwind v4, Vite |
| State    | Zustand, TanStack React Query           |
| Backend  | Hono, Node.js, TypeScript               |
| Database | MongoDB + Mongoose                      |
| Docs     | Swagger UI via @hono/swagger-ui         |
| Tests    | Vitest                                  |
| CI/CD    | GitHub Actions                          |

## Supported AI Providers (25+)

OpenAI · Anthropic · Google Gemini · Groq · Perplexity · HuggingFace · Replicate · Mistral · Cohere · xAI (Grok) · NVIDIA NIM · OpenRouter · Together AI · ElevenLabs · AssemblyAI · DeepSeek · Stability AI · Fireworks AI · Voyage AI · Azure OpenAI · AWS Bedrock · AI21 Labs · DeepInfra · Cerebras · and more.

## Prerequisites

- Node.js 20+
- MongoDB running locally or a connection URI
- A GitHub Personal Access Token (optional but recommended for rate limits)

## Setup

### 1. Server

```bash
cd server
cp .env.example .env
# Edit .env and set GITHUB_TOKEN, MONGODB_URI, etc.
npm install
npm run dev
```

### 2. Client

```bash
cd client
npm install
npm run dev
```

Visit:

- **App**: http://localhost:5173
- **API Docs (Swagger)**: http://localhost:3001/ui

## Environment Variables

### Server (`server/.env`)

| Variable                | Default                              | Description                         |
| ----------------------- | ------------------------------------ | ----------------------------------- |
| `PORT`                  | `3001`                               | Server port                         |
| `MONGODB_URI`           | `mongodb://localhost:27017/sekreets` | MongoDB connection string           |
| `GITHUB_TOKEN`          | —                                    | GitHub PAT (increases rate limits)  |
| `NODE_ENV`              | `development`                        | Environment                         |
| `CORS_ORIGIN`           | `http://localhost:5173`              | Allowed CORS origin                 |
| `SCAN_INTERVAL_MINUTES` | `5`                                  | Auto-scan interval                  |
| `MAX_RESULTS_PER_SCAN`  | `100`                                | Max queries per scan run            |
| `RATE_LIMIT_DELAY_MS`   | `500`                                | Delay between GitHub API calls (ms) |

## Running Tests

```bash
cd server
npm test
```

## API Endpoints

| Method | Path                 | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/secrets`       | List secrets (paginated) |
| GET    | `/api/secrets/stats` | Statistics               |
| GET    | `/api/secrets/:id`   | Get single secret        |
| POST   | `/api/scan`          | Trigger a scan           |
| GET    | `/api/scan/jobs`     | List scan jobs           |
| GET    | `/api/providers`     | List supported providers |
| GET    | `/ui`                | Swagger UI               |
| GET    | `/openapi.json`      | OpenAPI spec             |

## Ethical Use

This tool is for **defensive security research and responsible disclosure only**.

- Keys are masked in the UI — never fully displayed
- Do not use discovered keys for any purpose
- Follow responsible disclosure practices
- Comply with GitHub's Terms of Service

## License

MIT
