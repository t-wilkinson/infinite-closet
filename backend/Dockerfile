# syntax=docker/dockerfile:1

FROM node:14-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./providers ./providers
RUN yarn install
COPY . .

ENV NODE_ENV production
RUN yarn build
EXPOSE 1337
CMD ["yarn", "start"]
