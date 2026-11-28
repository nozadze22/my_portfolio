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
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="long-random-string" \
  CORS_ORIGIN="https://your-frontend.example.com" \
  R2_ACCOUNT_ID="..." \
  R2_ACCESS_KEY_ID="..." \
  R2_ACCESS_KEY_SECRET="..." \
  R2_BUCKET="portfolio" \
  R2_PUBLIC_BASE_URL="https://pub-xxxx.r2.dev"
```

Optional: `SITE_OWNER_*`, `REGISTRATION_OPEN`, `JWT_EXPIRES`, etc. (see `.env.example`).

## Deploy

```bash
cd backend
fly deploy
```

Open: `https://portfolio.fly.dev` (or your app name).

Health check: `GET /profile` (public) or your API root.

Release step runs `pnpm exec prisma migrate deploy` (Prisma 6 from the image — not `npx`, which can pull Prisma 8 and fail).

## Frontend

Set `NEXT_PUBLIC_API_URL=https://portfolio.fly.dev` in the Next.js `.env.production` or hosting env.

## Uploads folder

Local `uploads/` on Fly is ephemeral unless you attach a [volume](https://fly.io/docs/reference/volumes/). Prefer **R2** for images in production.