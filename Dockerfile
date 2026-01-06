# --------------------------------------------------------
# Stage 0: Base with JRE 17 and Node.js 22
# --------------------------------------------------------
FROM eclipse-temurin:17-jre AS base

# 安裝 Node.js 22 必要工具
RUN apt-get update && apt-get install -y curl ca-certificates gnupg --no-install-recommends \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 安裝 pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --------------------------------------------------------
# Stage 1: Dependencies
# --------------------------------------------------------
FROM base AS deps
WORKDIR /app

# 複製 monorepo 設定檔
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# 複製所有必要的 package.json 以安裝依賴
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/env/package.json ./packages/env/
COPY packages/types/package.json ./packages/types/
COPY packages/headers/package.json ./packages/headers/
COPY packages/multipart-parser/package.json ./packages/multipart-parser/

# 安裝依賴 (利用快取)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# --------------------------------------------------------
# Stage 2: Builder
# --------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
    
# 設定環境變數並編譯
ENV NODE_ENV=production
RUN pnpm build:web

# --------------------------------------------------------
# Stage 3: Runner (與 Base 一致，確保有 JRE 17 + Node 22)
# --------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Java 橋接通常需要明確的 JAVA_HOME
ENV JAVA_HOME=/opt/java/openjdk

# Move opencv libs to jdk's lib dir
COPY --from=builder /app/data/dcm4che/lib/linux-x86-64/*.so $JAVA_HOME/lib

# 建立非 root 使用者
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製編譯後的 Standalone 檔案
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.env ./.env

# 建立必要的資料夾並設定權限
RUN mkdir -p apps/web/brigid-local-db apps/web/logs && \
chown -R nextjs:nodejs apps/web/brigid-local-db apps/web/logs

USER nextjs

EXPOSE 3119
ENV PORT=3119
ENV HOSTNAME="0.0.0.0"

# 啟動應用程式
CMD ["node", "apps/web/server.js"]