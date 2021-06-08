# syntax=docker/dockerfile:1

FROM node:14-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG NODE_ENV
ARG NEXT_PUBLIC_FRONTEND
ARG NEXT_PUBLIC_BACKEND
ARG NEXT_PUBLIC_FIREBASE_CONFIG
ARG NEXT_PUBLIC_STRIPE_KEY
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app
ARG NODE_ENV
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["yarn", "start"]
