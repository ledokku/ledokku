import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, gql } from 'apollo-server-express';
import jsonwebtoken from 'jsonwebtoken';
import { Resolvers } from './generated/graphql';
import { mutations } from './graphql/mutations';
import { prisma } from './prisma';
import { config } from './config';
import { app, http, io } from './server';
import { queries } from './graphql/queries';

const typeDefs = gql`
  type Server {
    id: ID!
    name: String!
    # Ip is not available when the server is being created
    ip: String
    type: ServerTypes!
    status: ServerStatus!
    apps: [App!]
    databases: [Database!]
  }

  enum ServerTypes {
    AWS
    DIGITALOCEAN
    LINODE
  }

  enum ServerStatus {
    NEW
    ACTIVE
    OFF
    ARCHIVE
  }

  type App {
    id: ID!
    name: String!
  }

  type AppBuild {
    id: ID!
    status: AppBuildStatus!
  }

  enum AppBuildStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    ERRORED
  }

  type Database {
    id: ID!
    name: String!
    type: DatabaseTypes!
  }

  enum DatabaseTypes {
    REDIS
    POSTGRESQL
    MONGODB
    MYSQL
  }

  type LoginResult {
    token: String!
  }

  type CreateAppResult {
    app: App!
    appBuild: AppBuild!
  }

  type DokkuPlugin {
    name: String!
    version: String!
  }

  type DokkuPluginResult {
    version: String!
    plugins: [DokkuPlugin!]!
  }

  input CreateAppInput {
    serverId: String!
    name: String!
    gitUrl: String!
  }

  input CreateDatabaseInput {
    serverId: String!
    name: String!
    type: DatabaseTypes!
  }

  type Query {
    servers: [Server!]
    server(id: String!): Server
    dokkuPlugins: DokkuPluginResult!
  }

  type Mutation {
    loginWithGithub(code: String!): LoginResult
    saveDigitalOceanAccessToken(digitalOceanAccessToken: String!): Boolean
    createDigitalOceanServer(serverName: String!): Server!
    deleteDigitalOceanServer(serverId: String!): Boolean
    createApp(input: CreateAppInput!): CreateAppResult!
    createDatabase(input: CreateDatabaseInput!): Database!
    updateServerInfo(serverId: String!): Boolean
  }
`;

const resolvers: Resolvers<{ userId?: string }> = {
  Query: queries,
  Mutation: mutations,
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

io.on('connection', function () {
  console.log('a user connected');
});

http.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  )
);
