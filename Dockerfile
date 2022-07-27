FROM node:16-alpine3.15 as dep
RUN apk add --no-cache libc6-compat nasm autoconf automake bash libltdl libtool gcc make g++ zlib-dev
WORKDIR /app

#==================================================================

# ==================================================================
FROM node:16-alpine3.15 AS builder
WORKDIR /app

RUN npm install --location=global lerna
COPY . .

RUN npm i
RUN lerna run --scope @gff/core compile
RUN lerna run --scope @gff/core build
RUN lerna run --scope portal-proto build
# ==================================================================

FROM node:16-alpine3.15 AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat nasm autoconf automake bash
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nextjs /app/lerna.json ./lerna.json
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/public ./packages/portal-proto/public
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/package.json ./packages/portal-proto/package.json
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/.next ./packages/portal-proto/.next
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/node_modules ./packages/portal-proto/node_modules
COPY --from=builder --chown=nextjs:nextjs /app/packages/portal-proto/next.config.js ./packages/portal-proto/next.config.js

RUN mkdir -p  ./packages/portal-proto/.next && chown nextjs:nextjs  ./packages/portal-proto/.next
VOLUME  ./packages/portal-proto/.next
USER nextjs

EXPOSE 3000
ENV PORT 3000
####################################################
COPY ./ /portal2

WORKDIR /portal2

ENV REACT_APP_GDC_DISPLAY_SLIDES=true \
    REACT_APP_SLIDE_IMAGE_ENDPOINT="https://api.gdc.cancer.gov/tile/" \
    REACT_APP_GDC_AUTH="https://portal.gdc.cancer.gov/auth/" \
    REACT_APP_API="https://portal.gdc.cancer.gov/auth/api/v0/" \
    GDC_BASE="/" \
    REACT_APP_WEBSITE_NAME=GDC \
    NODE_PATH=src/packages


RUN export REACT_APP_COMMIT_HASH=`git rev-parse --short HEAD` && export REACT_APP_COMMIT_TAG=`git tag -l --points-at HEAD`

RUN npm install
RUN npm run build

FROM ${registry}/ncigdc/nginx-extras:1.2.0

RUN rm -v /etc/nginx/sites-enabled/default

COPY --from=builder /portal/build /usr/share/nginx/html

##########################################################
User root

CMD ["npm", "run", "start"]
