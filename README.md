# Git Files

A lightweight self-hosted Git server with a web UI for browsing repos. Built with [node-git-server](https://github.com/nicolo-ribaudo/node-git-server).

## Setup

```bash
npm install
```

## Development

```bash
node server.js
```

Open [http://localhost:7005](http://localhost:7005).

## Production

Deployed with PM2 on port 4005.

```bash
pm2 start ecosystem.config.js
```

## Features

- Bare Git repo hosting (push/fetch over HTTP)
- Web UI listing repos with branches and sizes
- Auto-create repos on first push
- Path-based routing via `BASE_PATH` env var

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `7005` | Server port |
| `BASE_PATH` | `/` | URL base path (e.g. `/repos`) |
