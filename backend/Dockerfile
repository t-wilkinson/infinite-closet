# syntax=docker/dockerfile:1

FROM node:14-alpine as deps
WORKDIR /app
COPY package.json yarn.lock .
COPY ./providers ./providers
RUN yarn install --frozen-lockfile

FROM node:14-alpine as builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG NODE_ENV
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
