# Covasant Agent Control Tower - Frontend (React)

A centralized UI to monitor, manage, and control Covasant agents via REST APIs.

## Features

- Agents list with status and quick actions
- Agent details: status, metadata, and controls (start/stop/restart/pause/resume)
- Activity logs viewer with filters and pagination
- Dashboard with aggregate metrics and alerts
- Light/Dark theme toggle
- API client with environment-based configuration

## Configuration

Copy `.env.example` to `.env` and set the API base URL:

```
REACT_APP_API_BASE_URL=https://your-api-base
REACT_APP_API_TIMEOUT_MS=10000
```

Do not commit secrets. Environment variables are injected at build time.

## Development

Install dependencies and start:

```
npm install
npm start
```

Open http://localhost:3000 to view it.

## Testing

```
npm test
```

## Build

```
npm run build
```

## Structure

- `src/services/api.js` — API client (fetch-based)
- `src/context/AppContext.js` — Theme and API context
- `src/components` — Reusable UI components
- `src/pages` — App pages: Agents, Agent Details, Logs, Dashboard
- `src/App.js` — Routing and layout

## Notes

- This frontend expects a backend exposing REST endpoints:
  - GET /agents
  - GET /agents/:id
  - GET /agents/:id/status
  - POST /agents/:id/commands { command, payload? }
  - GET /agents/:id/logs?limit=&level=&since=&until=&cursor=
  - GET /dashboard

Adjust `src/services/api.js` if your endpoints differ.
