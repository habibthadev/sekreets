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

`GITHUB_TOKEN` is optional, but recommended to increase GitHub API rate limits while scanning public repositories.

#### How to get a GitHub personal access token

GitHub supports two personal token types:

- **Fine-grained personal access token**: recommended for this project because it is more restricted and safer by default.
- **Personal access token (classic)**: older token type with broader access. Use it only if you specifically need it.

This project only reads public GitHub data, so a **fine-grained token** is the best option in most cases.

#### Option 1: Fine-grained token (recommended)

1. Open GitHub `Settings`.
2. Go to `Developer settings`.
3. Open `Personal access tokens`.
4. Click `Fine-grained tokens`.
5. Click `Generate new token`.
6. Give it a name like `sekreets-local`.
7. Set an expiration date.
8. Choose your personal account as the resource owner.
9. Keep repository access as limited as possible.
10. Do not grant write, admin, or private repository permissions unless you explicitly need them for another use case.
11. Generate the token and copy it immediately.

Recommended for this repo:

- Token type: `Fine-grained`
- Resource owner: your personal GitHub account
- Repository access: minimal
- Permissions: read-only usage for public GitHub API access

#### Option 2: Personal access token (classic)

Use this only if you cannot use a fine-grained token.

1. Open GitHub `Settings`.
2. Go to `Developer settings`.
3. Open `Personal access tokens`.
4. Click `Tokens (classic)`.
5. Click `Generate new token (classic)`.
6. Give it a name like `sekreets-local-classic`.
7. Set an expiration date.
8. Select only the minimum scopes you need.
9. Generate the token and copy it immediately.

If you use a classic token for this project:

- Keep scopes as minimal as possible
- Do not grant write, delete, admin, or workflow scopes unless you explicitly need them
- This app only reads public GitHub API data, so broad scopes are unnecessary

Add the token to your server env file:

```env
GITHUB_TOKEN=your_token_here
```

Notes:

- The app can run without a token, but GitHub rate limits will be much lower.
- This token is used for public GitHub API requests such as code search and reading repository file contents.
- Never commit your token to Git.
- If a token leaks, revoke it immediately in GitHub settings and create a new one.

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
