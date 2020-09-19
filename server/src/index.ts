import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, gql, withFilter } from 'apollo-server-express';
import { PubSub } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import path from 'path';
import { Resolvers } from './generated/graphql';
import { customResolvers } from './graphql/resolvers';
import { mutations } from './graphql/mutations';
import { config } from './config';
import { app, http, io } from './server';
import { queries } from './graphql/queries';

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

const typeDefs = gql`
  scalar DateTime

  type App {
    id: ID!
    name: String!
    createdAt: DateTime!
    databases: [Database!]
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
    createdAt: DateTime!
    apps: [App!]
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
  }

  type DestroyAppResult {
    result: Boolean!
  }

  type DestroyDatabaseResult {
    result: Boolean!
  }

  type LinkDatabaseResult {
    result: Boolean!
  }

  type UnlinkDatabaseResult {
    result: Boolean!
  }

  type DokkuPlugin {
    name: String!
    version: String!
  }

  type DokkuPluginResult {
    version: String!
    plugins: [DokkuPlugin!]!
  }

  type SetEnvVarResult {
    result: Boolean!
  }

  type UnsetEnvVarResult {
    result: Boolean!
  }

  type AppLogsResult {
    logs: [String!]!
  }

  type DatabaseInfoResult {
    info: [String]!
  }

  type DatabaseLogsResult {
    logs: [String]!
  }

  type DatabasesLinkedToAppResult {
    databases: [Database]!
  }

  type AppsLinkedToDatabaseResult {
    apps: [App]!
  }

  type IsDatabaseLinkedResult {
    isLinked: Boolean!
  }

  type EnvVar {
    key: String!
    value: String!
  }

  type EnvVarsResult {
    envVars: [EnvVar!]!
  }

  type SetupResult {
    canConnectSsh: Boolean!
    sshPublicKey: String!
  }

  type IsPluginInstalledResult {
    isPluginInstalled: Boolean!
  }

  input CreateAppInput {
    name: String!
  }

  input CreateDatabaseInput {
    name: String!
    type: DatabaseTypes!
  }

  input SetEnvVarInput {
    appId: String!
    key: String!
    value: String!
  }

  input UnsetEnvVarInput {
    appId: String!
    key: String!
  }

  input DestroyAppInput {
    appId: String!
  }

  input LinkDatabaseInput {
    appId: String!
    databaseId: String!
  }

  input UnlinkDatabaseInput {
    appId: String!
    databaseId: String!
  }

  input DestroyDatabaseInput {
    databaseId: String!
  }

  type Query {
    setup: SetupResult!
    apps: [App!]!
    app(appId: String!): App
    database(databaseId: String!): Database
    databases: [Database!]!
    isPluginInstalled(pluginName: String!): IsPluginInstalledResult!
    dokkuPlugins: DokkuPluginResult!
    appLogs(appId: String!): AppLogsResult!
    databaseInfo(databaseId: String!): DatabaseInfoResult!
    databaseLogs(databaseId: String!): DatabaseLogsResult!
    databasesLinkedToApp(appId: String!): DatabasesLinkedToAppResult!
    appsLinkedToDatabase(databaseId: String!): AppsLinkedToDatabaseResult!
    isDatabaseLinked(
      databaseId: String!
      appId: String!
    ): IsDatabaseLinkedResult!
    envVars(appId: String!): EnvVarsResult!
  }

  type Subscription {
    unlinkDatabaseLogs: [String!]
  }

  type Mutation {
    loginWithGithub(code: String!): LoginResult
    createApp(input: CreateAppInput!): CreateAppResult!
    createDatabase(input: CreateDatabaseInput!): Database!
    setEnvVar(input: SetEnvVarInput!): SetEnvVarResult!
    unsetEnvVar(input: UnsetEnvVarInput!): UnsetEnvVarResult!
    destroyApp(input: DestroyAppInput!): DestroyAppResult!
    destroyDatabase(input: DestroyDatabaseInput!): DestroyDatabaseResult!
    linkDatabase(input: LinkDatabaseInput!): LinkDatabaseResult!
    unlinkDatabase(input: UnlinkDatabaseInput!): UnlinkDatabaseResult!
  }
`;

export const pubsub = new PubSub();
export const DATABASE_UNLINKED = 'DATABASE_UNLINKED';

const resolvers: Resolvers<{ userId?: string }> = {
  Query: queries,
  Mutation: mutations,
  Subscription: {
    unlinkDatabaseLogs: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([DATABASE_UNLINKED]),
    },
  },
  ...customResolvers,
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    ...resolvers,
    DateTime: DateTimeResolver,
  },
  context: ({ req, connection }) => {
    if (connection) {
      return connection.context;
    }
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

apolloServer.installSubscriptionHandlers(http);

/**
 * Serve the runtime config to the client.
 * Will only be used on production.
 */
app.get('/runtime-config.js', (_, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.end(`
  window['runConfig'] = {
    GITHUB_CLIENT_ID: '${config.githubClientId}'
  }
  `);
});

app.get('*', (_, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'client', 'build', 'index.html')
  );
});

io.on('connection', function () {
  console.log('a user connected');
});

http.listen({ port: 4000 }, () => {
  console.log(
    `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:4000${apolloServer.subscriptionsPath}`
  );
});
