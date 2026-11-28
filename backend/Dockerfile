# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@10.33.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

RUN mkdir -p uploads

EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist/main.js"]