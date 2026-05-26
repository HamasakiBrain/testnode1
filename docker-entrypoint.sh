#!/bin/sh
set -e

echo "▶ Running Prisma migrate deploy..."
npx prisma migrate deploy

echo "▶ Running Prisma seed (idempotent)..."
npx prisma db seed

echo "▶ Starting Next.js application..."
exec "$@"
