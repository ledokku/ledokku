# First step is to generate a static build for the client
FROM node:12-alpine AS BUILD_CLIENT

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY client/package.json ./client/package.json

RUN yarn install --frozen-lockfile

COPY client ./client

RUN cd client && yarn build

# Then we build the server
FROM node:12-alpine AS BUILD_SERVER

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY server/package.json ./server/package.json
# Prisma folder is needed to in order to generate the prisma client
COPY server/prisma ./server/prisma

RUN yarn install --frozen-lockfile

COPY server ./server

RUN cd server && yarn build

# Last step, we prepare everything for the server
FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY server/package.json ./server/package.json
# Prisma folder is needed in order to run the migrations
COPY server/prisma ./server/prisma

# Copy the client build folder so we can expose it to the user
COPY --from=BUILD_CLIENT /usr/src/app/client/build ./client/build
# Copy the compiled server code
COPY --from=BUILD_SERVER /usr/src/app/server/build ./server/build

ENV NODE_ENV production

# We install only the production dependencies to reduce the size of the final image
RUN yarn install --frozen-lockfile --production

WORKDIR /usr/src/app/server

EXPOSE 4000
CMD [ "yarn", "start" ]
