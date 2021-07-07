# syntax=docker/dockerfile:1
ARG NODE_ENV=development
ARG FRONTEND_DOMAIN

# alpine wont work for now because of the low-level `sharp` library
FROM node:14-buster-slim as deps
WORKDIR /app
COPY package.json yarn.lock .
COPY ./providers ./providers
RUN yarn install --frozen-lockfile

FROM node:14-buster-slim as test
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn run test --passWithNoTests

FROM test as development-build

FROM test as production-build
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM ${NODE_ENV}-build as final
