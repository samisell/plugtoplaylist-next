# Install dependencies only when needed
FROM node:18-bullseye-slim AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM node:18-bullseye-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provide safe defaults so build-time evaluation does not fail in CI/Portainer.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="mysql://playlists:PLAYlists@mysql:3306/playlists"
ENV SMTP_HOST="localhost"
ENV SMTP_PORT="587"
ENV SMTP_USER="build@example.com"
ENV SMTP_PASS="build"
ENV ADMIN_EMAIL="admin@example.com"
ENV SITE_NAME="PlugToPlaylist"
ENV STRIPE_SECRET_KEY="sk_test_build"
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_build"
ENV STRIPE_WEBHOOK_SECRET="whsec_build"
ENV SPOTIFY_CLIENT_ID="build"
ENV SPOTIFY_CLIENT_SECRET="build"
ENV YOUTUBE_API_KEY="build"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_PUBLIC_TURNSTILE_ENABLED="false"
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY="build"
ENV TURNSTILE_SECRET_KEY="build"

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
RUN npx prisma generate

# Production image, copy all the files and run next
FROM node:18-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

COPY --from=builder /app ./
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["sh", "-lc", "npm run build && node .next/standalone/server.js"]
