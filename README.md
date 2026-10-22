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
- Configurable repos directory via `REPOS_DIR` env var
- Path-based routing via `BASE_PATH` env var

## Comparison with other Git hosting tools

To help decide if Git Files is suited for your needs, here is how it compares to other self-hosted Git options (table style borrowed from the [Gitea comparison](https://docs.gitea.com/installation/comparison/)).

We don't regularly check for feature changes in other products, so this list may be outdated. If you find anything that needs updating, please open an issue.

*Symbols used in table:*

- *✓ — supported*
- *⁄ — supported with limited functionality*
- *✘ — unsupported*
- *? — unknown*

| Feature | Git Files | Gitea | Forgejo | GitLab CE | Gogs | cgit |
| --- | --- | --- | --- | --- | --- | --- |
| Open source and free | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| No external database required | ✓ | ✓ | ✓ | ✘ | ✓ | ✓ |
| Low RAM/CPU usage | ✓ | ✓ | ✓ | ✘ | ✓ | ✓ |
| Push/fetch over HTTP | ✓ | ✓ | ✓ | ✓ | ✓ | ✘ |
| Auto-create repo on first push | ✓ | ✓ | ✓ | ✓ | ? | ✘ |
| Web UI listing repos/branches | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| File and commit browsing | ✘ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Users and authentication | ✘ | ✓ | ✓ | ✓ | ✓ | ✘ |
| Issue tracker | ✘ | ✓ | ✓ | ✓ | ✘ | ✘ |
| Pull/Merge requests | ✘ | ✓ | ✓ | ✓ | ✓ | ✘ |
| Built-in CI/CD | ✘ | ✓ | ✓ | ✓ | ✘ | ✘ |
| Package/Container registry | ✘ | ✓ | ✓ | ✓ | ✘ | ✘ |

**When to choose what:** Git Files is the right fit when you only need to push repositories over HTTP and see what's there — one Node process, no database, no accounts. Pick [Gitea](https://gitea.com) or [Forgejo](https://forgejo.org) if you need code browsing, issues, pull requests or CI; pick GitLab if you need everything in one box and don't mind the resource usage.

> **Note:** Git Files has no authentication — anyone who can reach the server can push and fetch. Put it behind a reverse proxy with auth, or only expose it on a trusted network.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `7005` | Server port |
| `BASE_PATH` | `/` | URL base path (e.g. `/repos`) |
| `REPOS_DIR` | `repos` next to `server.js` | Directory holding the bare repositories (absolute, or relative to the working directory) |
