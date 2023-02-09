FROM node:18-alpine AS base

FROM base AS pruner
# Prepare work directory
WORKDIR /app

# Prepare pnpm https://pnpm.io/installation#using-corepack
RUN corepack enable && \
    corepack prepare --activate pnpm@latest

# Prepare deps
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add git --no-cache



# Prepare build deps ( ignore postinstall scripts for now )
COPY . .

FROM base AS builder

WORKDIR /app


# Prepare pnpm https://pnpm.io/installation#using-corepack
RUN corepack enable && \
    corepack prepare --activate pnpm@latest

# Prepare deps
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add git --no-cache


# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY tsconfig.json tsconfig.json
COPY .npmrc .npmrc
COPY --from=pruner /app/pnpm-*.yaml ./
COPY --from=pruner ./app/ ./
RUN rm -rf ./node_modules

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install

# Build the project
RUN pnpm run build


FROM base AS runner

# ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system --gid 1001 server
RUN adduser --system --uid 1001 server
RUN chown -R server:server /app

COPY --from=builder --chown=server:server /app/ ./

USER server


CMD ["node", "dist/index.js"]