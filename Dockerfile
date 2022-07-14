FROM node:16-alpine3.15 as dep
RUN apk add --no-cache libc6-compat nasm autoconf automake bash libltdl libtool gcc make g++ zlib-dev
WORKDIR /app

# ==================================================================
