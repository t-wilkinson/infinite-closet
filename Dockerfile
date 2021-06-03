# syntax=docker/dockerfile:1

FROM node:14.17.0 as base
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN yarn install
# COPY . .

FROM base as test
RUN echo testing...

FROM base as development
RUN echo building development...

FROM base as prod
RUN echo building production...
