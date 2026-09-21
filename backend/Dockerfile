# --------------------------------------------------------
# Stage 1: Build & Dependencies
# --------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# --------------------------------------------------------
# Stage 2: Production Runtime with Python & Java Sandbox
# --------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Install Python 3 and OpenJDK 17 for code evaluation sandbox
RUN apk add --no-cache python3 openjdk17-jre-headless bash coreutils

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create dedicated non-root application user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

CMD ["node", "dist/server.js"]
