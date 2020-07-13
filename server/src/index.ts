import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, gql } from 'apollo-server-express';
import { DateTimeResolver } from 'graphql-scalars';
import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import path from 'path';
import { Resolvers } from './generated/graphql';
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
    githubRepoUrl: String!
    createdAt: DateTime!
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

  type DestroyAppResult {
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
    logs: String!
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

  input CreateAppInput {
    name: String!
    gitUrl: String!
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

  type Query {
    setup: SetupResult!
    apps: [App!]!
    app(appId: String!): App
    databases: [Database!]!
    dokkuPlugins: DokkuPluginResult!
    appLogs(appId: String!): AppLogsResult!
    envVars(appId: String!): EnvVarsResult!
  }

  type Mutation {
    loginWithGithub(code: String!): LoginResult
    createApp(input: CreateAppInput!): CreateAppResult!
    createDatabase(input: CreateDatabaseInput!): Database!
    setEnvVar(input: SetEnvVarInput!): SetEnvVarResult!
    unsetEnvVar(input: UnsetEnvVarInput!): UnsetEnvVarResult!
    destroyApp(input: DestroyAppInput!): DestroyAppResult!
  }
`;

const resolvers: Resolvers<{ userId?: string }> = {
  Query: queries,
  Mutation: mutations,
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    ...resolvers,
    DateTime: DateTimeResolver,
  },
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

/**
 * Serve the runtime config to the client.
 * Will only be used on production.
 */
app.get('/runtime-config.js', (_, res) => {
  res.setHeader('Content-Type', 'application/javascript');
});

app.get('*', (_, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'client', 'build', 'index.html')
  );
});

io.on('connection', function () {
  console.log('a user connected');
});

http.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  )
);
