# Linksaver

A bookmark manager with a REST API and simple web UI.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/bookmarks | List all bookmarks |
| POST | /api/bookmarks | Create bookmark `{ title, url, tags? }` |
| GET | /api/bookmarks/:id | Get single bookmark |
| PUT | /api/bookmarks/:id | Update bookmark |
| DELETE | /api/bookmarks/:id | Delete bookmark |

## Bookmark schema

```json
{ "id": 1, "title": "string", "url": "string", "tags": [], "favorite": false, "createdAt": "ISO8601" }
```

## Run

```bash
npm start   # port 3000, or PORT env var
```
