ARG BASE_CONTAINER_VERSION=4.4.0
ARG BASE_CONTAINER_REGISTRY=docker.osdc.io/ncigdc


#==================================================================
# Build all packages required for portal-proto
# ==================================================================
FROM ${BASE_CONTAINER_REGISTRY}/nodejs24:${BASE_CONTAINER_VERSION} AS builder
ARG NPM_REGISTRY="https://registry.npmjs.org/"

ARG BUILD_SHORT_SHA
ENV NEXT_PUBLIC_BUILD_SHORT_SHA=$BUILD_SHORT_SHA

WORKDIR /app
ENV npm_config_registry=$NPM_REGISTRY

COPY ./package.json ./package-lock.json ./lerna.json ./nx.json ./
COPY ./packages/core/package.json ./packages/core/
COPY ./packages/sapien/package.json ./packages/sapien/
COPY ./packages/survivalplot/package.json ./packages/survivalplot/
COPY ./packages/portal-proto/package.json ./packages/portal-proto/
RUN npm ci --include=dev
COPY ./packages ./packages

RUN npx lerna run build --ignore enclave-portal

# ==================================================================
# Run portal-proto app
# ==================================================================

FROM ${BASE_CONTAINER_REGISTRY}/nodejs24:${BASE_CONTAINER_VERSION} AS runner
ARG NAME=gdc-frontend-framework

LABEL org.opencontainers.image.title=${NAME} \
      org.opencontainers.image.description="${NAME} container image" \
      org.opencontainers.image.source="https://github.com/NCI-GDC/${NAME}" \
      org.opencontainers.image.vendor="NCI GDC"

WORKDIR /app
ENV NODE_ENV=production \
  PORT=3000

COPY --from=builder --chown=app:app /app/lerna.json ./lerna.json
COPY --from=builder --chown=app:app /app/nx.json ./nx.json
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages/portal-proto/public ./packages/portal-proto/public
COPY --from=builder --chown=app:app /app/packages/portal-proto/package.json ./packages/portal-proto/package.json
COPY --from=builder --chown=app:app /app/packages/portal-proto/.next ./packages/portal-proto/.next
COPY --from=builder --chown=app:app /app/packages/portal-proto/node_modules ./packages/portal-proto/node_modules
COPY --from=builder --chown=app:app /app/packages/portal-proto/next.config.js ./packages/portal-proto/next.config.js

RUN mkdir -p ./packages/portal-proto/.next \
  && chown app:app ./packages/portal-proto/.next
VOLUME ./packages/portal-proto/.next
USER app:app

EXPOSE 3000

CMD ["npm", "run", "start"]
