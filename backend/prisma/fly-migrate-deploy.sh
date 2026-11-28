#!/bin/sh
set -e

# Neon pooler cannot hold Prisma migrate advisory locks (P1002) — use direct host for migrate only.
MIGRATE_URL="$DATABASE_URL"

case "$MIGRATE_URL" in
  *"-pooler."*)
    MIGRATE_URL=$(echo "$MIGRATE_URL" | sed 's/-pooler//')
    ;;
esac

export DATABASE_URL="$MIGRATE_URL"
export PRISMA_MIGRATE_ADVISORY_LOCK_TIMEOUT="${PRISMA_MIGRATE_ADVISORY_LOCK_TIMEOUT:-60000}"

exec pnpm exec prisma migrate deploy