FROM node:20-slim AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --include=dev --include=optional --no-audit --no-fund \
    && npm install --no-save @tailwindcss/oxide-linux-x64-gnu --no-audit --no-fund || true

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Runner stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install runtime dependencies (OpenSSL is required by Prisma)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# IMPORTANT: Copy Prisma and bcryptjs modules specifically for our seeding/migration scripts
# Next.js standalone build sometimes misses these or doesn't include CLI binaries
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/effect ./node_modules/effect
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

# Copy Prisma files and seeding scripts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/seed-admin.js ./seed-admin.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Run migrations, seed the admin users, and start the server
# Using local prisma binary (v6) to avoid Prisma v7 breaking changes
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy || npx prisma@6.11.1 migrate deploy || true; node seed-admin.js || true; node server.js"]