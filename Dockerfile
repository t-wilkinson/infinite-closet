# syntax=docker/dockerfile:1

FROM node:14.17.0 as base
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN yarn install

FROM base as prod
RUN yarn --cwd frontend build
RUN yarn --cwd backend build
