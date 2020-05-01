import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, gql } from 'apollo-server-express';
import jsonwebtoken from 'jsonwebtoken';
import { Resolvers } from './generated/graphql';
import { loginWithGithub } from './graphql/mutations/loginWithGithub';
import { saveDigitalOceanAccessToken } from './graphql/mutations/saveDigitalOceanAccessToken';
import { createDigitalOceanServer } from './graphql/mutations/createDigitalOceanServer';
import { deleteDigitalOceanServer } from './graphql/mutations/deleteDigitalOceanServer';
import { updateServerInfo } from './graphql/mutations/updateServerInfo';
import { createDatabase } from './graphql/mutations/createDatabase';
import { createApp } from './graphql/mutations/createApp';
import { prisma } from './prisma';
import { config } from './config';
import { app, http, io } from './server';
import { queries } from './graphql/queries';

const typeDefs = gql`
  type Server {
    id: ID!
    name: String!
    ip: String!
    apps: [App!]
    databases: [Database!]
  }

  type App {
    id: ID!
    name: String!
  }

  type Database {
    id: ID!
    name: String!
  }

  type LoginResult {
    token: String!
  }

  input CreateAppInput {
    serverId: String!
    name: String!
    gitUrl: String!
  }

  input CreateDatabaseInput {
    serverId: String!
    name: String!
  }

  type Query {
    servers: [Server!]
    server(id: String!): Server
  }

  type Mutation {
    loginWithGithub(code: String!): LoginResult
    saveDigitalOceanAccessToken(digitalOceanAccessToken: String!): Boolean
    createDigitalOceanServer(serverName: String!): Server!
    deleteDigitalOceanServer(serverId: String!): Boolean
    createApp(input: CreateAppInput!): App!
    createDatabase(input: CreateDatabaseInput!): Database!
    updateServerInfo(serverId: String!): Boolean
  }
`;

const resolvers: Resolvers<{ userId?: string }> = {
  Query: queries,
  Mutation: {
    loginWithGithub,
    saveDigitalOceanAccessToken,
    createDigitalOceanServer,
    deleteDigitalOceanServer,
    updateServerInfo,
    createDatabase,
    createApp,
  },
  Server: {
    apps: async (server) => {
      const serverApps = await prisma.app.findMany({
        where: { serverId: server.id },
      });
      return serverApps;
    },
    databases: async (server) => {
      const serverDatabases = await prisma.database.findMany({
        where: { serverId: server.id },
      });
      return serverDatabases;
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token =
      req.headers['authorization'] &&
      (req.headers['authorization'] as string).replace('Bearer ', '');

    let userId: string | undefined;
    try {
      const decoded = jsonwebtoken.verify(token, config.jwtSecret) as {
        userId: string;
      };
      userId = decoded.userId;
    } catch (err) {
      // Invalid token
    }
    return {
      userId,
    };
  },
});
apolloServer.applyMiddleware({ app });

io.on('connection', function (socket) {
  console.log('a user connected');
});

http.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  )
);
