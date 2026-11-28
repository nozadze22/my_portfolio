# Fly.io — `portfolio` backend

## Prerequisites

1. Install CLI: https://fly.io/docs/hands-on/install-flyctl/  
   Windows (PowerShell):

   ```powershell
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. Log in:

   ```bash
   fly auth login
   ```

3. PostgreSQL — use [Neon](https://neon.tech), [Fly Postgres](https://fly.io/docs/postgres/), or another host. Copy the connection string as `DATABASE_URL`.

## App name

The global name `portfolio` is already taken on Fly. This repo is wired to **`giorgi-portfolio-api`** (`https://giorgi-portfolio-api.fly.dev`).

If you create a new app, run `fly apps create <your-name>` and set `app = '<your-name>'` in `fly.toml`.

## Secrets (required)

```bash
fly secrets set \
  DATABASE_URL="postgresql://...-pooler....neon.tech/neondb?sslmode=require" \
  JWT_SECRET="long-random-string" \
  CORS_ORIGIN="https://your-frontend.example.com" \
  R2_ACCOUNT_ID="..." \
  R2_ACCESS_KEY_ID="..." \
  R2_ACCESS_KEY_SECRET="..." \
  R2_BUCKET="portfolio" \
  R2_PUBLIC_BASE_URL="https://pub-xxxx.r2.dev"
```

Optional: `SITE_OWNER_*`, `REGISTRATION_OPEN`, `JWT_EXPIRES`, etc. (see `.env.example`).

**Neon + migrations:** `DATABASE_URL` can stay on the **pooler** for the API. On deploy, `prisma/fly-migrate-deploy.sh` auto-strips `-pooler` from the host only while running `migrate deploy` (avoids P1002).

## Deploy

```bash
cd backend
fly deploy
```

Open: `https://portfolio.fly.dev` (or your app name).

Health check: `GET /profile` (public) or your API root.

Release step runs `sh prisma/fly-migrate-deploy.sh` → `prisma migrate deploy` on a **direct** DB URL (Prisma 6 from the image — not `npx`, which can pull Prisma 8 and fail).

## Frontend

Set `NEXT_PUBLIC_API_URL=https://giorgi-portfolio-api.fly.dev` in Vercel → Project → Settings → Environment Variables (Production).

`CORS_ORIGIN` on Fly must match your Vercel site exactly, e.g. `https://my-portfolio-ten-livid-30.vercel.app` (comma-separated if you have several).

Without R2 secrets, uploads fall back to **ephemeral local disk** on Fly (images disappear) and URLs break on the public site — always set all `R2_*` variables in production.

## Fly secrets one-shot (PowerShell)

```powershell
cd backend
fly secrets set `
  DATABASE_URL="postgresql://..." `
  JWT_SECRET="..." `
  CORS_ORIGIN="https://YOUR-VERCEL-APP.vercel.app" `
  R2_ACCOUNT_ID="..." `
  R2_ACCESS_KEY_ID="..." `
  R2_ACCESS_KEY_SECRET="..." `
  R2_BUCKET="portfolio" `
  R2_PUBLIC_BASE_URL="https://pub-xxxx.r2.dev" `
  JWT_EXPIRES_MS="900000" `
  JWT_REFRESH_EXPIRES_MS="2592000000" `
  -a giorgi-portfolio-api
```

## Uploads folder

Local `uploads/` on Fly is ephemeral unless you attach a [volume](https://fly.io/docs/reference/volumes/). Prefer **R2** for images in production.