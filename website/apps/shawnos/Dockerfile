# Multi-stage Dockerfile for shawnos.ai (Next.js 15 standalone)
# Build context: repo root (shawn-gtme-os/) — needed because standalone
# output traces into content/ and data/ above website/

FROM node:20-alpine AS deps
WORKDIR /app
COPY website/package.json website/package-lock.json ./website/
COPY website/apps/shawnos/package.json ./website/apps/shawnos/package.json
COPY website/packages/shared/package.json ./website/packages/shared/package.json
RUN cd website && npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/website/node_modules ./website/node_modules
COPY website/ ./website/
COPY content/ ./content/
COPY data/ ./data/
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd website && npx turbo run build --filter=@shawnos/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# standalone output uses apps/ root (not website/apps/) since workspace root is website/
COPY --from=builder /app/website/apps/shawnos/public ./apps/shawnos/public
COPY --from=builder --chown=nextjs:nodejs /app/website/apps/shawnos/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/website/apps/shawnos/.next/static ./apps/shawnos/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/shawnos/server.js"]
