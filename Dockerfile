FROM node:20.11.0-alpine3.18 as depz
WORKDIR /app

#==================================================================

# ==================================================================
FROM node:20.11.0-alpine3.18 AS builder
ARG NPM_REGISTRY="https://registry.npmjs.org/"

ARG BUILD_SHORT_SHA
ENV NEXT_PUBLIC_BUILD_SHORT_SHA=$BUILD_SHORT_SHA

WORKDIR /app
ENV npm_config_registry=$NPM_REGISTRY
RUN npm install --location=global lerna@6.6.1
COPY ./package.json ./package-lock.json lerna.json ./
COPY ./packages/core/package.json ./packages/core/
COPY ./packages/sapien/package.json ./packages/sapien/
COPY ./packages/portal-proto/package.json ./packages/portal-proto/
RUN npm ci
COPY ./packages ./packages

RUN lerna run --scope @gff/core compile
RUN lerna run --scope @gff/core build
RUN lerna run --scope @nci-gdc/sapien compile
RUN lerna run --scope @nci-gdc/sapien build
RUN lerna run --scope portal-proto build
# ==================================================================

FROM node:20.11.0-alpine3.18 AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

RUN  addgroup --system --gid 1001 nextjs && adduser --system --uid 1001 nextjs

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
