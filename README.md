# test11 — Settings API

Minimal Node.js settings API for auto-qa functional validation.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/settings | Get current settings |
| POST | /api/settings | Update settings |

## Settings

| Field | Type | Default |
|-------|------|---------|
| theme | string | "light" |
| notifications | boolean | true |
