FROM node:18-bullseye-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY package.json package-lock.json* ./

# Ensure optional native deps (notably Tailwind oxide) are present in Linux builds.
RUN npm install --include=optional --no-audit --no-fund \
  && npm install --no-save @tailwindcss/oxide-linux-x64-gnu --no-audit --no-fund || true \
  && npm cache clean --force

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-lc", "npx prisma migrate deploy || true; npm run build; node .next/standalone/server.js"]
