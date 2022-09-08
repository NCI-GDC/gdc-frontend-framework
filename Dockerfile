FROM node:16-alpine3.15 as dep
RUN apk add --no-cache libc6-compat nasm autoconf automake bash libltdl libtool gcc make g++ zlib-dev
WORKDIR /app

#==================================================================

# ==================================================================
FROM node:16-alpine3.15 AS builder
ARG NPM_REGISTRY="https://registry.npmjs.org/"

WORKDIR /app
ENV npm_config_registry=$NPM_REGISTRY
# Copy .npm if present
COPY . .np* .
RUN npm install --location=global lerna --cache .npm

RUN npm i --cache .npm
RUN lerna run --scope @gff/core compile
RUN lerna run --scope @gff/core build
RUN lerna run --scope portal-proto build
# ==================================================================

FROM node:16-alpine3.15 AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

RUN apk add --no-cache libc6-compat nasm autoconf automake bash \
  && addgroup --system --gid 1001 nextjs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nextjs /app/lerna.json ./lerna.json
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/public ./packages/portal-proto/public
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/package.json ./packages/portal-proto/package.json
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/.next ./packages/portal-proto/.next
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/node_modules ./packages/portal-proto/node_modules
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/next.config.js ./packages/portal-proto/next.config.js

RUN mkdir -p ./packages/portal-proto/.next \
  && chown nextjs:nextjs ./packages/portal-proto/.next
VOLUME  ./packages/portal-proto/.next
USER nextjs

EXPOSE 3000

User root

CMD ["npm", "run", "start"]
