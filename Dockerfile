# First step is to generate a static build for the client
FROM node:12-alpine AS BUILD_CLIENT

WORKDIR /usr/src/app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm ci

COPY client ./client

RUN cd client && npm run build build

# Then we build the server
FROM node:12-alpine AS BUILD_SERVER

WORKDIR /usr/src/app

COPY package*.json ./
COPY server/package*.json ./server/
# Prisma folder is needed to in order to generate the prisma client
COPY server/prisma ./server/prisma

RUN npm ci

COPY server ./server

RUN cd server && npm run build

# Last step, we prepare everything for the server
FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY server/package*.json ./server/
# Prisma folder is needed in order to run the migrations
COPY server/prisma ./server/prisma

# Copy the client build folder so we can expose it to the user
COPY --from=BUILD_CLIENT /usr/src/app/client/build ./client/build
# Copy the compiled server code
COPY --from=BUILD_SERVER /usr/src/app/server/build ./server/build

ENV NODE_ENV production

# We install only the production dependencies to reduce the size of the final image
RUN npm ci --production

WORKDIR /usr/src/app/server

EXPOSE 4000
CMD [ "npm", "start" ]
