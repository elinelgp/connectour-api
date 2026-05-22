# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

# Install dependencies (cached layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source and build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
RUN pnpm build

# Prune dev dependencies
RUN pnpm prune --prod

# ---------- Stage 2: Production ----------
FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]