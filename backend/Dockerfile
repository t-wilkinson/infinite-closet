# syntax=docker/dockerfile:1
ARG NODE_ENV=development
ARG FRONTEND_DOMAIN

# alpine wont work for now because of the low-level `sharp` library
FROM node:14 as deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./providers ./providers
RUN apt update && apt install -y \
    python
RUN yarn install

FROM node:14 as base
WORKDIR /app
COPY . ./
COPY --from=deps /app/node_modules ./node_modules

FROM base as test-build
RUN yarn run test --passWithNoTests

FROM base as development-build

FROM base as production-build
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM ${NODE_ENV}-build as final
