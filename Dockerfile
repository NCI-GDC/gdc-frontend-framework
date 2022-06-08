FROM node:16-alpine3.15 as dep
RUN apk add --no-cache libc6-compat nasm autoconf automake bash libltdl libtool gcc make g++ zlib-dev
WORKDIR /app

# ==================================================================
FROM node:16-alpine3.15 AS builder
WORKDIR /app
RUN npm install --location=global lerna
COPY . .

RUN npm ci --network-timeout 1000000
RUN lerna bootstrap
RUN npm run build

# ==================================================================

FROM node:16-alpine3.15 AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat nasm autoconf automake bash
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/public ./packages/portal-proto/public
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/package.json ./packages/portal-proto/package.json
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/.next ./packages/portal-proto/.next
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/node_modules ./packages/portal-proto/node_modules
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/next.config.js ./packages/portal-proto/next.config.js

RUN mkdir -p ./packages/portal-proto/.next/cache/images
RUN chown nextjs ./packages/portal-proto/.next/cache/images
USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]
