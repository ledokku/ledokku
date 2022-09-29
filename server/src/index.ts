import 'reflect-metadata';
import {
  ApolloServer,
  gql,
  makeExecutableSchema,
  mergeSchemas,
} from 'apollo-server-express';
import createDebug from 'debug';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { DateTimeResolver } from 'graphql-scalars';
import { PubSub } from 'graphql-subscriptions';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import { container } from 'tsyringe';
import { buildSchemaSync } from 'type-graphql';
import { config } from './config';
import { authChecker } from './config/auth_checker';
import { ContextFactory } from './config/context_factory';
import { PORT } from './constants';
import { Resolvers } from './generated/graphql';
import { mutations } from './graphql/mutations';
import { queries } from './graphql/queries';
import { customResolvers } from './graphql/resolvers';
import { handleWebhooks } from './lib/webhooks/handleWebhooks';
import { DokkuContext } from './models/dokku_context';
import { prisma } from './prisma';
import { synchroniseServerQueue } from './queues/synchroniseServer';
import { app, http } from './server.old';

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

export const typeDefs = gql`
  scalar DateTime

  type App {
    id: ID!
    name: String!
    createdAt: DateTime!
    type: AppTypes!
    databases: [Database!]
    appMetaGithub: AppMetaGithub
  }

  type GithubAppInstallationId {
    id: String!
  }

  type AppMetaGithub {
    repoId: String!
    repoName: String!
    repoOwner: String!
    branch: String!
    githubAppInstallationId: String!
  }

  type Repository {
    id: String!
    name: String!
    fullName: String!
    private: Boolean!
  }

  type Branch {
    name: String!
  }

  enum AppTypes {
    DOKKU
    GITHUB
    GITLAB
    DOCKER
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
    version: String
    createdAt: DateTime!
    apps: [App!]
  }

  enum DatabaseTypes {
    REDIS
    POSTGRESQL
    MONGODB
    MYSQL
  }

  type Domains {
    domains: [String!]!
  }

  type RealTimeLog {
    message: String
    type: String
  }

  type LoginResult {
    token: String!
  }

  type RegisterGithubAppResult {
    githubAppClientId: String!
  }

  type CreateAppDokkuResult {
    appId: String!
  }

  type CreateAppGithubResult {
    result: Boolean!
  }

  type DestroyAppResult {
    result: Boolean!
  }

  type RestartAppResult {
    result: Boolean!
  }

  type RebuildAppResult {
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

  type CreateDatabaseResult {
    result: Boolean!
  }

  type AppLogsResult {
    logs: [String!]!
  }

  type DatabaseInfoResult {
    info: [String!]!
  }

  type DatabaseLogsResult {
    logs: [String]!
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

  type SetDomainResult {
    result: Boolean!
  }

  type AddDomainResult {
    result: Boolean!
  }

  type RemoveDomainResult {
    result: Boolean!
  }

  type SetupResult {
    canConnectSsh: Boolean!
    sshPublicKey: String!
    isGithubAppSetup: Boolean!
    githubAppManifest: String!
  }

  type IsPluginInstalledResult {
    isPluginInstalled: Boolean!
  }

  type AppProxyPort {
    scheme: String!
    host: String!
    container: String!
  }

  input CreateAppDokkuInput {
    name: String!
  }

  input CreateAppGithubInput {
    name: String!
    gitRepoFullName: String!
    branchName: String!
    gitRepoId: String!
    githubInstallationId: String!
  }

  input RestartAppInput {
    appId: String!
  }

  input RebuildAppInput {
    appId: String!
  }

  input CreateDatabaseInput {
    name: String!
    type: DatabaseTypes!
  }

  input UnlinkDatabaseInput {
    appId: String!
    databaseId: String!
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

  input AddDomainInput {
    appId: String!
    domainName: String!
  }

  input RemoveDomainInput {
    appId: String!
    domainName: String!
  }

  input SetDomainInput {
    appId: String!
    domainName: String!
  }

  input LinkDatabaseInput {
    appId: String!
    databaseId: String!
  }

  input DestroyDatabaseInput {
    databaseId: String!
  }

  input AddAppProxyPortInput {
    appId: String!
    host: String!
    container: String!
  }

  input RemoveAppProxyPortInput {
    appId: String!
    scheme: String!
    host: String!
    container: String!
  }

  type Query {
    domains(appId: String!): Domains!
    dokkuPlugins: DokkuPluginResult!
  }

  type Subscription {
    unlinkDatabaseLogs: RealTimeLog!
    linkDatabaseLogs: RealTimeLog!
    createDatabaseLogs: RealTimeLog!
    appRestartLogs: RealTimeLog!
    appRebuildLogs: RealTimeLog!
    appCreateLogs: RealTimeLog!
  }

  type Mutation {
    loginWithGithub(code: String!): LoginResult
    registerGithubApp(code: String!): RegisterGithubAppResult
    addDomain(input: AddDomainInput!): AddDomainResult!
    removeDomain(input: RemoveDomainInput!): RemoveDomainResult!
    setDomain(input: SetDomainInput!): SetDomainResult!
    createAppDokku(input: CreateAppDokkuInput!): CreateAppDokkuResult!
    createDatabase(input: CreateDatabaseInput!): CreateDatabaseResult!
    setEnvVar(input: SetEnvVarInput!): SetEnvVarResult!
    unsetEnvVar(input: UnsetEnvVarInput!): UnsetEnvVarResult!
    destroyApp(input: DestroyAppInput!): DestroyAppResult!
    restartApp(input: RestartAppInput!): RestartAppResult!
    rebuildApp(input: RebuildAppInput!): RebuildAppResult!
    destroyDatabase(input: DestroyDatabaseInput!): DestroyDatabaseResult!
    linkDatabase(input: LinkDatabaseInput!): LinkDatabaseResult!
    unlinkDatabase(input: UnlinkDatabaseInput!): UnlinkDatabaseResult!
    addAppProxyPort(input: AddAppProxyPortInput!): Boolean
    removeAppProxyPort(input: RemoveAppProxyPortInput!): Boolean
    createAppGithub(input: CreateAppGithubInput!): CreateAppGithubResult!
  }
`;

export const pubsub = new PubSub();
export const DATABASE_UNLINKED = 'DATABASE_UNLINKED';
export const DATABASE_LINKED = 'DATABASE_LINKED';
export const DATABASE_CREATED = 'DATABASE_CREATED';
export const APP_RESTARTED = 'APP_RESTARTED';
export const APP_REBUILT = 'APP_REBUILT';
export const APP_CREATED = 'APP_CREATED';

export const resolvers: Resolvers<{ userId?: string }> = {
  Query: queries,
  Mutation: mutations,
  Subscription: {
    unlinkDatabaseLogs: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([DATABASE_UNLINKED]),
    },
    linkDatabaseLogs: {
      subscribe: () => pubsub.asyncIterator([DATABASE_LINKED]),
    },
    createDatabaseLogs: {
      subscribe: () => pubsub.asyncIterator([DATABASE_CREATED]),
    },
    appRestartLogs: {
      subscribe: () => pubsub.asyncIterator([APP_RESTARTED]),
    },
    appRebuildLogs: {
      subscribe: () => pubsub.asyncIterator([APP_REBUILT]),
    },
    appCreateLogs: {
      subscribe: () => pubsub.asyncIterator([APP_CREATED]),
    },
  },
  ...customResolvers,
};

interface SubscriptionContext {
  token?: string;
}

const oldSchema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,
    DateTime: DateTimeResolver,
  },
});

const newSchema = buildSchemaSync({
  resolvers: [__dirname + '/modules/**/*.resolver.{ts,js}'],
  container: { get: (clazz) => container.resolve(clazz) },
  authChecker,
});

export const stitchedSchema = mergeSchemas({
  schemas: [oldSchema, newSchema],
});

export const apolloServer = new ApolloServer({
  schema: stitchedSchema,
  // typeDefs,
  // resolvers: {
  //   ...resolvers,
  //   DateTime: DateTimeResolver,
  // },
  formatResponse(response, requestContext) {
    if ('sshContext' in requestContext.context) {
      (requestContext.context as DokkuContext).sshContext.connection.dispose();
    }

    return response;
  },
  subscriptions: {
    onConnect: async (context: SubscriptionContext) => {
      if (!context.token) {
        throw new Error('Missing auth token');
      }
      try {
        const decoded = jsonwebtoken.verify(
          context.token,
          config.jwtSecret
        ) as {
          userId: string;
        };
        const userId = decoded.userId;

        const userInDb = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!userInDb) throw new Error("User doesn't exist in our db");
      } catch (e) {
        throw new Error('Invalid token');
      }
    },
  },

  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    }

    return ContextFactory.createFromHTTP(req);
  },
});
apolloServer.applyMiddleware({ app: app as any });

apolloServer.installSubscriptionHandlers(http);

/**
 * Serve the runtime config to the client.
 * Will only be used on production.
 */
app.get('/runtime-config.js', (_, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.end(`
  window['runConfig'] = {
    GITHUB_APP_CLIENT_ID: '${config.githubAppClientId}',
    TELEMETRY_DISABLED: '${config.telemetryDisabled}',
    GITHUB_APP_NAME: '${config.githubAppName}'
  }
  `);
});

app.get('*', (_, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'client', 'build', 'index.html')
  );
});
const debug = createDebug(`webhooks`);

app.post('/api/webhooks', async (req, res) => {
  debug('received request -----------------------------', req.body);

  if (req.header('x-github-event') === 'push') {
    try {
      await handleWebhooks(req as any);
      res.status(200).end();
    } catch (e) {
      res.status(500).send(e);
    }
  }

  res.json({ success: true });
});

http.listen({ port: PORT }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );

  /**
   * In development we use the smee proxy to forward the external calls to our app
   */
  if (process.env.NODE_ENV !== 'production') {
    require('./smeeClient');
  }

  // When the server boot we start the synchronisation with dokku
  synchroniseServerQueue.add('synchronise-server', {});
});
