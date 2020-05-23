import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, gql } from 'apollo-server-express';
import jsonwebtoken from 'jsonwebtoken';
import { Resolvers } from './generated/graphql';
import { mutations } from './graphql/mutations';
import { config } from './config';
import { app, http, io } from './server';
import { queries } from './graphql/queries';

const typeDefs = gql`
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

  type AddEnvVarResult {
    result: String!
  }

  type DeleteEnvVarResult {
    result: String!
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

  input CreateAppInput {
    name: String!
    gitUrl: String!
  }

  input CreateDatabaseInput {
    name: String!
    type: DatabaseTypes!
  }

  input AddEnvVarInput {
    name: String!
    key: String!
    value: String!
  }

  input DeleteEnvVarInput {
    name: String!
    key: String!
  }

  type Query {
    dokkuPlugins: DokkuPluginResult!
    appLogs(name: String!): AppLogsResult!
    envVars(name: String!): EnvVarsResult!
  }

  type Mutation {
    loginWithGithub(code: String!): LoginResult
    createApp(input: CreateAppInput!): CreateAppResult!
    createDatabase(input: CreateDatabaseInput!): Database!
    addEnvVar(input: AddEnvVarInput!): AddEnvVarResult!
    deleteEnvVar(input: DeleteEnvVarInput!): DeleteEnvVarResult!
  }
`;

const resolvers: Resolvers<{ userId?: string }> = {
  Query: queries,
  Mutation: mutations,
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
