ARG BASE_VERSION=3.0.1-rc2
ARG REGISTRY=docker.osdc.io/ncigdc

FROM ${REGISTRY}/nodejs20:${BASE_VERSION} as dep
WORKDIR /app

#==================================================================

# ==================================================================
FROM ${REGISTRY}/nodejs20:${BASE_VERSION} AS builder
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
RUN npm ci --include=dev
COPY ./packages ./packages

RUN lerna run --scope @gff/core compile
RUN lerna run --scope @gff/core build
RUN lerna run --scope @nci-gdc/sapien compile
RUN lerna run --scope @nci-gdc/sapien build
RUN lerna run --scope portal-proto build
# ==================================================================

FROM ${REGISTRY}/nodejs20:${BASE_VERSION} AS runner
ARG NAME=gdc-frontend-framework

LABEL org.opencontainers.image.title=${NAME} \
      org.opencontainers.image.description="${NAME} container image" \
      org.opencontainers.image.source="https://github.com/NCI-GDC/${NAME}" \
      org.opencontainers.image.vendor="NCI GDC"

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=builder --chown=app:app /app/lerna.json ./lerna.json
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/packages/portal-proto/public ./packages/portal-proto/public
COPY --from=builder --chown=app:app /app/packages/portal-proto/package.json ./packages/portal-proto/package.json
COPY --from=builder --chown=app:app /app/packages/portal-proto/.next ./packages/portal-proto/.next
COPY --from=builder --chown=app:app /app/packages/portal-proto/node_modules ./packages/portal-proto/node_modules
COPY --from=builder --chown=app:app /app/packages/portal-proto/next.config.js ./packages/portal-proto/next.config.js

RUN mkdir -p ./packages/portal-proto/.next \
  && chown app:app ./packages/portal-proto/.next
VOLUME  ./packages/portal-proto/.next
USER app:app

EXPOSE 3000

CMD ["npm", "run", "start"]
