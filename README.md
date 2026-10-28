# JavaScript Backend Starter

A small deployable REST API using Node.js and Express. It includes a health check, JSON error handling, security headers, configurable CORS, request logging, and an in-memory Tasks API.

> **Data note:** tasks are stored in memory, so they reset when the server restarts or redeploys. Connect a database before using this for real user data.

## Requirements
- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

API runs at `http://localhost:3000`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Examples

List tasks:
```bash
curl http://localhost:3000/api/tasks
```

Create a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy my backend","description":"Ship the first version"}'
```

Update a task:
```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

## Deploy to Render

1. Push this folder to a GitHub repository.
2. In Render, choose **New + → Blueprint** and select the repository, or create a **Web Service**.
3. Use build command `npm install` and start command `npm start`.
4. Set `CORS_ORIGIN` to your frontend's origin (for example, `https://your-frontend.example`).
5. Deploy. Render should use `/health` as the health-check path.

The included `render.yaml` is a Render Blueprint configuration. If you deploy through a Blueprint, review the settings before confirming.

## Deploy with Docker

```bash
docker build -t js-backend-starter .
docker run --rm -p 3000:3000 -e PORT=3000 js-backend-starter
```

## Before production

- Replace the in-memory task store with a persistent database such as PostgreSQL or MongoDB.
- Add authentication and authorization if endpoints contain private data.
- Configure `CORS_ORIGIN` to your actual frontend domain rather than `*`.
- Add rate limiting, input validation, monitoring, and automated tests for your use case.
- Never commit `.env` or secrets to source control.
