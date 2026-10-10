# Bun Builder
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY prisma ./prisma/

RUN bun install --frozen-lockfile

COPY . .
RUN bunx prisma generate
RUN bun run build

# Node Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]

