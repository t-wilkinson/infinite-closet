# syntax=docker/dockerfile:1
ARG NODE_ENV=development
ARG FRONTEND_DOMAIN

FROM node:14-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:14-alpine AS base
WORKDIR /app
COPY . ./
COPY --from=deps /app/node_modules ./node_modules

FROM base AS development-runner

FROM base AS test-runner
RUN yarn run test --passWithNoTests

FROM base AS production-builder
ARG NEXT_PUBLIC_FRONTEND
ARG NEXT_PUBLIC_BACKEND
ARG NEXT_PUBLIC_FIREBASE_CONFIG
ARG NEXT_PUBLIC_STRIPE_KEY
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:14-alpine AS production-runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
COPY --from=production-builder /app/next.config.js .
COPY --from=production-builder /app/public ./public
COPY --from=production-builder --chown=nodejs:nodejs /app/.next ./.next
COPY --from=production-builder /app/node_modules ./node_modules
COPY --from=production-builder /app/package.json ./package.json
USER nodejs

FROM ${NODE_ENV}-runner as final
