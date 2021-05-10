/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};



export type App = {
  __typename?: 'App';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  type: AppTypes;
  databases?: Maybe<Array<Database>>;
  appMetaGithub?: Maybe<AppMetaGithub>;
};

export type User = {
  __typename?: 'User';
  userName: Scalars['String'];
};

export type GithubAppInstallationId = {
  __typename?: 'GithubAppInstallationId';
  id: Scalars['String'];
};

export type AppMetaGithub = {
  __typename?: 'AppMetaGithub';
  repoId: Scalars['String'];
  repoName: Scalars['String'];
  repoOwner: Scalars['String'];
  branch: Scalars['String'];
  githubAppInstallationId: Scalars['String'];
};

export type Repository = {
  __typename?: 'Repository';
  id: Scalars['String'];
  name: Scalars['String'];
  fullName: Scalars['String'];
  private: Scalars['Boolean'];
};

export type Branch = {
  __typename?: 'Branch';
  name: Scalars['String'];
};

export type AppTypes =
  | 'DOKKU'
  | 'GITHUB'
  | 'GITLAB'
  | 'DOCKER';

export type AppBuild = {
  __typename?: 'AppBuild';
  id: Scalars['ID'];
  status: AppBuildStatus;
};

export type AppBuildStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ERRORED';

export type Database = {
  __typename?: 'Database';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: DatabaseTypes;
  version?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  apps?: Maybe<Array<App>>;
};

export type DatabaseTypes =
  | 'REDIS'
  | 'POSTGRESQL'
  | 'MONGODB'
  | 'MYSQL';

export type Domains = {
  __typename?: 'Domains';
  domains: Array<Scalars['String']>;
};

export type RealTimeLog = {
  __typename?: 'RealTimeLog';
  message?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  token: Scalars['String'];
};

export type RegisterGithubAppResult = {
  __typename?: 'RegisterGithubAppResult';
  githubAppClientId: Scalars['String'];
};

export type CreateAppDokkuResult = {
  __typename?: 'CreateAppDokkuResult';
  appId: Scalars['String'];
};

export type CreateAppGithubResult = {
  __typename?: 'CreateAppGithubResult';
  result: Scalars['Boolean'];
};

export type DestroyAppResult = {
  __typename?: 'DestroyAppResult';
  result: Scalars['Boolean'];
};

export type RestartAppResult = {
  __typename?: 'RestartAppResult';
  result: Scalars['Boolean'];
};

export type RebuildAppResult = {
  __typename?: 'RebuildAppResult';
  result: Scalars['Boolean'];
};

export type DestroyDatabaseResult = {
  __typename?: 'DestroyDatabaseResult';
  result: Scalars['Boolean'];
};

export type LinkDatabaseResult = {
  __typename?: 'LinkDatabaseResult';
  result: Scalars['Boolean'];
};

export type UnlinkDatabaseResult = {
  __typename?: 'UnlinkDatabaseResult';
  result: Scalars['Boolean'];
};

export type DokkuPlugin = {
  __typename?: 'DokkuPlugin';
  name: Scalars['String'];
  version: Scalars['String'];
};

export type DokkuPluginResult = {
  __typename?: 'DokkuPluginResult';
  version: Scalars['String'];
  plugins: Array<DokkuPlugin>;
};

export type SetEnvVarResult = {
  __typename?: 'SetEnvVarResult';
  result: Scalars['Boolean'];
};

export type UnsetEnvVarResult = {
  __typename?: 'UnsetEnvVarResult';
  result: Scalars['Boolean'];
};

export type CreateDatabaseResult = {
  __typename?: 'CreateDatabaseResult';
  result: Scalars['Boolean'];
};

export type AppLogsResult = {
  __typename?: 'AppLogsResult';
  logs: Array<Scalars['String']>;
};

export type DatabaseInfoResult = {
  __typename?: 'DatabaseInfoResult';
  info: Array<Scalars['String']>;
};

export type DatabaseLogsResult = {
  __typename?: 'DatabaseLogsResult';
  logs: Array<Maybe<Scalars['String']>>;
};

export type IsDatabaseLinkedResult = {
  __typename?: 'IsDatabaseLinkedResult';
  isLinked: Scalars['Boolean'];
};

export type EnvVar = {
  __typename?: 'EnvVar';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type EnvVarsResult = {
  __typename?: 'EnvVarsResult';
  envVars: Array<EnvVar>;
};

export type SetDomainResult = {
  __typename?: 'SetDomainResult';
  result: Scalars['Boolean'];
};

export type AddDomainResult = {
  __typename?: 'AddDomainResult';
  result: Scalars['Boolean'];
};

export type RemoveDomainResult = {
  __typename?: 'RemoveDomainResult';
  result: Scalars['Boolean'];
};

export type SetupResult = {
  __typename?: 'SetupResult';
  canConnectSsh: Scalars['Boolean'];
  sshPublicKey: Scalars['String'];
  isGithubAppSetup: Scalars['Boolean'];
  githubAppManifest: Scalars['String'];
};

export type IsPluginInstalledResult = {
  __typename?: 'IsPluginInstalledResult';
  isPluginInstalled: Scalars['Boolean'];
};

export type AppProxyPort = {
  __typename?: 'AppProxyPort';
  scheme: Scalars['String'];
  host: Scalars['String'];
  container: Scalars['String'];
};

export type CreateAppDokkuInput = {
  name: Scalars['String'];
};

export type CreateAppGithubInput = {
  name: Scalars['String'];
  gitRepoFullName: Scalars['String'];
  branchName: Scalars['String'];
  gitRepoId: Scalars['String'];
  githubInstallationId: Scalars['String'];
};

export type RestartAppInput = {
  appId: Scalars['String'];
};

export type RebuildAppInput = {
  appId: Scalars['String'];
};

export type CreateDatabaseInput = {
  name: Scalars['String'];
  type: DatabaseTypes;
};

export type UnlinkDatabaseInput = {
  appId: Scalars['String'];
  databaseId: Scalars['String'];
};

export type SetEnvVarInput = {
  appId: Scalars['String'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type UnsetEnvVarInput = {
  appId: Scalars['String'];
  key: Scalars['String'];
};

export type DestroyAppInput = {
  appId: Scalars['String'];
};

export type AddDomainInput = {
  appId: Scalars['String'];
  domainName: Scalars['String'];
};

export type RemoveDomainInput = {
  appId: Scalars['String'];
  domainName: Scalars['String'];
};

export type SetDomainInput = {
  appId: Scalars['String'];
  domainName: Scalars['String'];
};

export type LinkDatabaseInput = {
  appId: Scalars['String'];
  databaseId: Scalars['String'];
};

export type DestroyDatabaseInput = {
  databaseId: Scalars['String'];
};

export type AddAppProxyPortInput = {
  appId: Scalars['String'];
  host: Scalars['String'];
  container: Scalars['String'];
};

export type RemoveAppProxyPortInput = {
  appId: Scalars['String'];
  scheme: Scalars['String'];
  host: Scalars['String'];
  container: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  githubInstallationId: GithubAppInstallationId;
  setup: SetupResult;
  apps: Array<App>;
  user: User;
  repositories: Array<Repository>;
  branches: Array<Branch>;
  appMetaGithub?: Maybe<AppMetaGithub>;
  app?: Maybe<App>;
  domains: Domains;
  database?: Maybe<Database>;
  databases: Array<Database>;
  isPluginInstalled: IsPluginInstalledResult;
  dokkuPlugins: DokkuPluginResult;
  appLogs: AppLogsResult;
  databaseInfo: DatabaseInfoResult;
  databaseLogs: DatabaseLogsResult;
  isDatabaseLinked: IsDatabaseLinkedResult;
  envVars: EnvVarsResult;
  appProxyPorts: Array<AppProxyPort>;
};


export type QueryRepositoriesArgs = {
  installationId: Scalars['String'];
};


export type QueryBranchesArgs = {
  repositoryName: Scalars['String'];
  installationId: Scalars['String'];
};


export type QueryAppMetaGithubArgs = {
  appId: Scalars['String'];
};


export type QueryAppArgs = {
  appId: Scalars['String'];
};


export type QueryDomainsArgs = {
  appId: Scalars['String'];
};


export type QueryDatabaseArgs = {
  databaseId: Scalars['String'];
};


export type QueryIsPluginInstalledArgs = {
  pluginName: Scalars['String'];
};


export type QueryAppLogsArgs = {
  appId: Scalars['String'];
};


export type QueryDatabaseInfoArgs = {
  databaseId: Scalars['String'];
};


export type QueryDatabaseLogsArgs = {
  databaseId: Scalars['String'];
};


export type QueryIsDatabaseLinkedArgs = {
  databaseId: Scalars['String'];
  appId: Scalars['String'];
};


export type QueryEnvVarsArgs = {
  appId: Scalars['String'];
};


export type QueryAppProxyPortsArgs = {
  appId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  unlinkDatabaseLogs: RealTimeLog;
  linkDatabaseLogs: RealTimeLog;
  createDatabaseLogs: RealTimeLog;
  appRestartLogs: RealTimeLog;
  appRebuildLogs: RealTimeLog;
  appCreateLogs: RealTimeLog;
};

export type Mutation = {
  __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  registerGithubApp?: Maybe<RegisterGithubAppResult>;
  addDomain: AddDomainResult;
  removeDomain: RemoveDomainResult;
  setDomain: SetDomainResult;
  createAppDokku: CreateAppDokkuResult;
  createDatabase: CreateDatabaseResult;
  setEnvVar: SetEnvVarResult;
  unsetEnvVar: UnsetEnvVarResult;
  destroyApp: DestroyAppResult;
  restartApp: RestartAppResult;
  rebuildApp: RebuildAppResult;
  destroyDatabase: DestroyDatabaseResult;
  linkDatabase: LinkDatabaseResult;
  unlinkDatabase: UnlinkDatabaseResult;
  addAppProxyPort?: Maybe<Scalars['Boolean']>;
  removeAppProxyPort?: Maybe<Scalars['Boolean']>;
  createAppGithub: CreateAppGithubResult;
};


export type MutationLoginWithGithubArgs = {
  code: Scalars['String'];
};


export type MutationRegisterGithubAppArgs = {
  code: Scalars['String'];
};


export type MutationAddDomainArgs = {
  input: AddDomainInput;
};


export type MutationRemoveDomainArgs = {
  input: RemoveDomainInput;
};


export type MutationSetDomainArgs = {
  input: SetDomainInput;
};


export type MutationCreateAppDokkuArgs = {
  input: CreateAppDokkuInput;
};


export type MutationCreateDatabaseArgs = {
  input: CreateDatabaseInput;
};


export type MutationSetEnvVarArgs = {
  input: SetEnvVarInput;
};


export type MutationUnsetEnvVarArgs = {
  input: UnsetEnvVarInput;
};


export type MutationDestroyAppArgs = {
  input: DestroyAppInput;
};


export type MutationRestartAppArgs = {
  input: RestartAppInput;
};


export type MutationRebuildAppArgs = {
  input: RebuildAppInput;
};


export type MutationDestroyDatabaseArgs = {
  input: DestroyDatabaseInput;
};


export type MutationLinkDatabaseArgs = {
  input: LinkDatabaseInput;
};


export type MutationUnlinkDatabaseArgs = {
  input: UnlinkDatabaseInput;
};


export type MutationAddAppProxyPortArgs = {
  input: AddAppProxyPortInput;
};


export type MutationRemoveAppProxyPortArgs = {
  input: RemoveAppProxyPortInput;
};


export type MutationCreateAppGithubArgs = {
  input: CreateAppGithubInput;
};

export type CacheControlScope =
  | 'PUBLIC'
  | 'PRIVATE';


export type AddAppProxyPortMutationVariables = Exact<{
  input: AddAppProxyPortInput;
}>;


export type AddAppProxyPortMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addAppProxyPort'>
);

export type AddDomainMutationVariables = Exact<{
  input: AddDomainInput;
}>;


export type AddDomainMutation = (
  { __typename?: 'Mutation' }
  & { addDomain: (
    { __typename?: 'AddDomainResult' }
    & Pick<AddDomainResult, 'result'>
  ) }
);

export type CreateAppDokkuMutationVariables = Exact<{
  input: CreateAppDokkuInput;
}>;


export type CreateAppDokkuMutation = (
  { __typename?: 'Mutation' }
  & { createAppDokku: (
    { __typename?: 'CreateAppDokkuResult' }
    & Pick<CreateAppDokkuResult, 'appId'>
  ) }
);

export type CreateAppGithubMutationVariables = Exact<{
  input: CreateAppGithubInput;
}>;


export type CreateAppGithubMutation = (
  { __typename?: 'Mutation' }
  & { createAppGithub: (
    { __typename?: 'CreateAppGithubResult' }
    & Pick<CreateAppGithubResult, 'result'>
  ) }
);

export type CreateDatabaseMutationVariables = Exact<{
  input: CreateDatabaseInput;
}>;


export type CreateDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { createDatabase: (
    { __typename?: 'CreateDatabaseResult' }
    & Pick<CreateDatabaseResult, 'result'>
  ) }
);

export type DestroyAppMutationVariables = Exact<{
  input: DestroyAppInput;
}>;


export type DestroyAppMutation = (
  { __typename?: 'Mutation' }
  & { destroyApp: (
    { __typename?: 'DestroyAppResult' }
    & Pick<DestroyAppResult, 'result'>
  ) }
);

export type DestroyDatabaseMutationVariables = Exact<{
  input: DestroyDatabaseInput;
}>;


export type DestroyDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { destroyDatabase: (
    { __typename?: 'DestroyDatabaseResult' }
    & Pick<DestroyDatabaseResult, 'result'>
  ) }
);

export type LinkDatabaseMutationVariables = Exact<{
  input: LinkDatabaseInput;
}>;


export type LinkDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { linkDatabase: (
    { __typename?: 'LinkDatabaseResult' }
    & Pick<LinkDatabaseResult, 'result'>
  ) }
);

export type LoginWithGithubMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type LoginWithGithubMutation = (
  { __typename?: 'Mutation' }
  & { loginWithGithub?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'token'>
  )> }
);

export type RebuildAppMutationVariables = Exact<{
  input: RebuildAppInput;
}>;


export type RebuildAppMutation = (
  { __typename?: 'Mutation' }
  & { rebuildApp: (
    { __typename?: 'RebuildAppResult' }
    & Pick<RebuildAppResult, 'result'>
  ) }
);

export type RegisterGithubAppMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type RegisterGithubAppMutation = (
  { __typename?: 'Mutation' }
  & { registerGithubApp?: Maybe<(
    { __typename?: 'RegisterGithubAppResult' }
    & Pick<RegisterGithubAppResult, 'githubAppClientId'>
  )> }
);

export type RemoveAppProxyPortMutationVariables = Exact<{
  input: RemoveAppProxyPortInput;
}>;


export type RemoveAppProxyPortMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeAppProxyPort'>
);

export type RemoveDomainMutationVariables = Exact<{
  input: RemoveDomainInput;
}>;


export type RemoveDomainMutation = (
  { __typename?: 'Mutation' }
  & { removeDomain: (
    { __typename?: 'RemoveDomainResult' }
    & Pick<RemoveDomainResult, 'result'>
  ) }
);

export type RestartAppMutationVariables = Exact<{
  input: RestartAppInput;
}>;


export type RestartAppMutation = (
  { __typename?: 'Mutation' }
  & { restartApp: (
    { __typename?: 'RestartAppResult' }
    & Pick<RestartAppResult, 'result'>
  ) }
);

export type SetDomainMutationVariables = Exact<{
  input: SetDomainInput;
}>;


export type SetDomainMutation = (
  { __typename?: 'Mutation' }
  & { setDomain: (
    { __typename?: 'SetDomainResult' }
    & Pick<SetDomainResult, 'result'>
  ) }
);

export type SetEnvVarMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
  appId: Scalars['String'];
}>;


export type SetEnvVarMutation = (
  { __typename?: 'Mutation' }
  & { setEnvVar: (
    { __typename?: 'SetEnvVarResult' }
    & Pick<SetEnvVarResult, 'result'>
  ) }
);

export type UnlinkDatabaseMutationVariables = Exact<{
  input: UnlinkDatabaseInput;
}>;


export type UnlinkDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { unlinkDatabase: (
    { __typename?: 'UnlinkDatabaseResult' }
    & Pick<UnlinkDatabaseResult, 'result'>
  ) }
);

export type UnsetEnvVarMutationVariables = Exact<{
  key: Scalars['String'];
  appId: Scalars['String'];
}>;


export type UnsetEnvVarMutation = (
  { __typename?: 'Mutation' }
  & { unsetEnvVar: (
    { __typename?: 'UnsetEnvVarResult' }
    & Pick<UnsetEnvVarResult, 'result'>
  ) }
);

export type AppByIdQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AppByIdQuery = (
  { __typename?: 'Query' }
  & { app?: Maybe<(
    { __typename?: 'App' }
    & Pick<App, 'id' | 'name' | 'createdAt'>
    & { databases?: Maybe<Array<(
      { __typename?: 'Database' }
      & Pick<Database, 'id' | 'name' | 'type'>
    )>>, appMetaGithub?: Maybe<(
      { __typename?: 'AppMetaGithub' }
      & Pick<AppMetaGithub, 'repoId' | 'repoName' | 'repoOwner' | 'branch' | 'githubAppInstallationId'>
    )> }
  )> }
);

export type AppLogsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AppLogsQuery = (
  { __typename?: 'Query' }
  & { appLogs: (
    { __typename?: 'AppLogsResult' }
    & Pick<AppLogsResult, 'logs'>
  ) }
);

export type AppProxyPortsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AppProxyPortsQuery = (
  { __typename?: 'Query' }
  & { appProxyPorts: Array<(
    { __typename?: 'AppProxyPort' }
    & Pick<AppProxyPort, 'scheme' | 'host' | 'container'>
  )> }
);

export type AppsQueryVariables = Exact<{ [key: string]: never; }>;


export type AppsQuery = (
  { __typename?: 'Query' }
  & { apps: Array<(
    { __typename?: 'App' }
    & Pick<App, 'id' | 'name'>
  )> }
);

export type BranchesQueryVariables = Exact<{
  installationId: Scalars['String'];
  repositoryName: Scalars['String'];
}>;


export type BranchesQuery = (
  { __typename?: 'Query' }
  & { branches: Array<(
    { __typename?: 'Branch' }
    & Pick<Branch, 'name'>
  )> }
);

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { apps: Array<(
    { __typename?: 'App' }
    & Pick<App, 'id' | 'name' | 'createdAt'>
    & { appMetaGithub?: Maybe<(
      { __typename?: 'AppMetaGithub' }
      & Pick<AppMetaGithub, 'repoName' | 'repoOwner'>
    )> }
  )>, databases: Array<(
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name' | 'type' | 'createdAt'>
  )> }
);

export type DatabaseByIdQueryVariables = Exact<{
  databaseId: Scalars['String'];
}>;


export type DatabaseByIdQuery = (
  { __typename?: 'Query' }
  & { database?: Maybe<(
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name' | 'type' | 'version'>
    & { apps?: Maybe<Array<(
      { __typename?: 'App' }
      & Pick<App, 'id' | 'name'>
    )>> }
  )> }
);

export type DatabaseInfoQueryVariables = Exact<{
  databaseId: Scalars['String'];
}>;


export type DatabaseInfoQuery = (
  { __typename?: 'Query' }
  & { databaseInfo: (
    { __typename?: 'DatabaseInfoResult' }
    & Pick<DatabaseInfoResult, 'info'>
  ) }
);

export type DatabaseLogsQueryVariables = Exact<{
  databaseId: Scalars['String'];
}>;


export type DatabaseLogsQuery = (
  { __typename?: 'Query' }
  & { databaseLogs: (
    { __typename?: 'DatabaseLogsResult' }
    & Pick<DatabaseLogsResult, 'logs'>
  ) }
);

export type DatabaseQueryVariables = Exact<{ [key: string]: never; }>;


export type DatabaseQuery = (
  { __typename?: 'Query' }
  & { databases: Array<(
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name' | 'type'>
  )> }
);

export type DomainsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type DomainsQuery = (
  { __typename?: 'Query' }
  & { domains: (
    { __typename?: 'Domains' }
    & Pick<Domains, 'domains'>
  ) }
);

export type EnvVarsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type EnvVarsQuery = (
  { __typename?: 'Query' }
  & { envVars: (
    { __typename?: 'EnvVarsResult' }
    & { envVars: Array<(
      { __typename?: 'EnvVar' }
      & Pick<EnvVar, 'key' | 'value'>
    )> }
  ) }
);

export type GithubInstallationIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GithubInstallationIdQuery = (
  { __typename?: 'Query' }
  & { githubInstallationId: (
    { __typename?: 'GithubAppInstallationId' }
    & Pick<GithubAppInstallationId, 'id'>
  ) }
);

export type IsPluginInstalledQueryVariables = Exact<{
  pluginName: Scalars['String'];
}>;


export type IsPluginInstalledQuery = (
  { __typename?: 'Query' }
  & { isPluginInstalled: (
    { __typename?: 'IsPluginInstalledResult' }
    & Pick<IsPluginInstalledResult, 'isPluginInstalled'>
  ) }
);

export type RepositoriesQueryVariables = Exact<{
  installationId: Scalars['String'];
}>;


export type RepositoriesQuery = (
  { __typename?: 'Query' }
  & { repositories: Array<(
    { __typename?: 'Repository' }
    & Pick<Repository, 'id' | 'name' | 'fullName' | 'private'>
  )> }
);

export type SetupQueryVariables = Exact<{ [key: string]: never; }>;


export type SetupQuery = (
  { __typename?: 'Query' }
  & { setup: (
    { __typename?: 'SetupResult' }
    & Pick<SetupResult, 'canConnectSsh' | 'sshPublicKey' | 'isGithubAppSetup' | 'githubAppManifest'>
  ) }
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'userName'>
  ) }
);

export type AppCreateLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AppCreateLogsSubscription = (
  { __typename?: 'Subscription' }
  & { appCreateLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);

export type CreateDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CreateDatabaseLogsSubscription = (
  { __typename?: 'Subscription' }
  & { createDatabaseLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);

export type LinkDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LinkDatabaseLogsSubscription = (
  { __typename?: 'Subscription' }
  & { linkDatabaseLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);

export type AppRebuildLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AppRebuildLogsSubscription = (
  { __typename?: 'Subscription' }
  & { appRebuildLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);

export type AppRestartLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AppRestartLogsSubscription = (
  { __typename?: 'Subscription' }
  & { appRestartLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);

export type UnlinkDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UnlinkDatabaseLogsSubscription = (
  { __typename?: 'Subscription' }
  & { unlinkDatabaseLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);


export const AddAppProxyPortDocument = gql`
    mutation addAppProxyPort($input: AddAppProxyPortInput!) {
  addAppProxyPort(input: $input)
}
    `;
export type AddAppProxyPortMutationFn = Apollo.MutationFunction<AddAppProxyPortMutation, AddAppProxyPortMutationVariables>;

/**
 * __useAddAppProxyPortMutation__
 *
 * To run a mutation, you first call `useAddAppProxyPortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAppProxyPortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAppProxyPortMutation, { data, loading, error }] = useAddAppProxyPortMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAppProxyPortMutation(baseOptions?: Apollo.MutationHookOptions<AddAppProxyPortMutation, AddAppProxyPortMutationVariables>) {
        return Apollo.useMutation<AddAppProxyPortMutation, AddAppProxyPortMutationVariables>(AddAppProxyPortDocument, baseOptions);
      }
export type AddAppProxyPortMutationHookResult = ReturnType<typeof useAddAppProxyPortMutation>;
export type AddAppProxyPortMutationResult = Apollo.MutationResult<AddAppProxyPortMutation>;
export type AddAppProxyPortMutationOptions = Apollo.BaseMutationOptions<AddAppProxyPortMutation, AddAppProxyPortMutationVariables>;
export const AddDomainDocument = gql`
    mutation addDomain($input: AddDomainInput!) {
  addDomain(input: $input) {
    result
  }
}
    `;
export type AddDomainMutationFn = Apollo.MutationFunction<AddDomainMutation, AddDomainMutationVariables>;

/**
 * __useAddDomainMutation__
 *
 * To run a mutation, you first call `useAddDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addDomainMutation, { data, loading, error }] = useAddDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddDomainMutation(baseOptions?: Apollo.MutationHookOptions<AddDomainMutation, AddDomainMutationVariables>) {
        return Apollo.useMutation<AddDomainMutation, AddDomainMutationVariables>(AddDomainDocument, baseOptions);
      }
export type AddDomainMutationHookResult = ReturnType<typeof useAddDomainMutation>;
export type AddDomainMutationResult = Apollo.MutationResult<AddDomainMutation>;
export type AddDomainMutationOptions = Apollo.BaseMutationOptions<AddDomainMutation, AddDomainMutationVariables>;
export const CreateAppDokkuDocument = gql`
    mutation createAppDokku($input: CreateAppDokkuInput!) {
  createAppDokku(input: $input) {
    appId
  }
}
    `;
export type CreateAppDokkuMutationFn = Apollo.MutationFunction<CreateAppDokkuMutation, CreateAppDokkuMutationVariables>;

/**
 * __useCreateAppDokkuMutation__
 *
 * To run a mutation, you first call `useCreateAppDokkuMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppDokkuMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppDokkuMutation, { data, loading, error }] = useCreateAppDokkuMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAppDokkuMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppDokkuMutation, CreateAppDokkuMutationVariables>) {
        return Apollo.useMutation<CreateAppDokkuMutation, CreateAppDokkuMutationVariables>(CreateAppDokkuDocument, baseOptions);
      }
export type CreateAppDokkuMutationHookResult = ReturnType<typeof useCreateAppDokkuMutation>;
export type CreateAppDokkuMutationResult = Apollo.MutationResult<CreateAppDokkuMutation>;
export type CreateAppDokkuMutationOptions = Apollo.BaseMutationOptions<CreateAppDokkuMutation, CreateAppDokkuMutationVariables>;
export const CreateAppGithubDocument = gql`
    mutation createAppGithub($input: CreateAppGithubInput!) {
  createAppGithub(input: $input) {
    result
  }
}
    `;
export type CreateAppGithubMutationFn = Apollo.MutationFunction<CreateAppGithubMutation, CreateAppGithubMutationVariables>;

/**
 * __useCreateAppGithubMutation__
 *
 * To run a mutation, you first call `useCreateAppGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppGithubMutation, { data, loading, error }] = useCreateAppGithubMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAppGithubMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppGithubMutation, CreateAppGithubMutationVariables>) {
        return Apollo.useMutation<CreateAppGithubMutation, CreateAppGithubMutationVariables>(CreateAppGithubDocument, baseOptions);
      }
export type CreateAppGithubMutationHookResult = ReturnType<typeof useCreateAppGithubMutation>;
export type CreateAppGithubMutationResult = Apollo.MutationResult<CreateAppGithubMutation>;
export type CreateAppGithubMutationOptions = Apollo.BaseMutationOptions<CreateAppGithubMutation, CreateAppGithubMutationVariables>;
export const CreateDatabaseDocument = gql`
    mutation createDatabase($input: CreateDatabaseInput!) {
  createDatabase(input: $input) {
    result
  }
}
    `;
export type CreateDatabaseMutationFn = Apollo.MutationFunction<CreateDatabaseMutation, CreateDatabaseMutationVariables>;

/**
 * __useCreateDatabaseMutation__
 *
 * To run a mutation, you first call `useCreateDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatabaseMutation, { data, loading, error }] = useCreateDatabaseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatabaseMutation, CreateDatabaseMutationVariables>) {
        return Apollo.useMutation<CreateDatabaseMutation, CreateDatabaseMutationVariables>(CreateDatabaseDocument, baseOptions);
      }
export type CreateDatabaseMutationHookResult = ReturnType<typeof useCreateDatabaseMutation>;
export type CreateDatabaseMutationResult = Apollo.MutationResult<CreateDatabaseMutation>;
export type CreateDatabaseMutationOptions = Apollo.BaseMutationOptions<CreateDatabaseMutation, CreateDatabaseMutationVariables>;
export const DestroyAppDocument = gql`
    mutation destroyApp($input: DestroyAppInput!) {
  destroyApp(input: $input) {
    result
  }
}
    `;
export type DestroyAppMutationFn = Apollo.MutationFunction<DestroyAppMutation, DestroyAppMutationVariables>;

/**
 * __useDestroyAppMutation__
 *
 * To run a mutation, you first call `useDestroyAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyAppMutation, { data, loading, error }] = useDestroyAppMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDestroyAppMutation(baseOptions?: Apollo.MutationHookOptions<DestroyAppMutation, DestroyAppMutationVariables>) {
        return Apollo.useMutation<DestroyAppMutation, DestroyAppMutationVariables>(DestroyAppDocument, baseOptions);
      }
export type DestroyAppMutationHookResult = ReturnType<typeof useDestroyAppMutation>;
export type DestroyAppMutationResult = Apollo.MutationResult<DestroyAppMutation>;
export type DestroyAppMutationOptions = Apollo.BaseMutationOptions<DestroyAppMutation, DestroyAppMutationVariables>;
export const DestroyDatabaseDocument = gql`
    mutation destroyDatabase($input: DestroyDatabaseInput!) {
  destroyDatabase(input: $input) {
    result
  }
}
    `;
export type DestroyDatabaseMutationFn = Apollo.MutationFunction<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>;

/**
 * __useDestroyDatabaseMutation__
 *
 * To run a mutation, you first call `useDestroyDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyDatabaseMutation, { data, loading, error }] = useDestroyDatabaseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDestroyDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>) {
        return Apollo.useMutation<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>(DestroyDatabaseDocument, baseOptions);
      }
export type DestroyDatabaseMutationHookResult = ReturnType<typeof useDestroyDatabaseMutation>;
export type DestroyDatabaseMutationResult = Apollo.MutationResult<DestroyDatabaseMutation>;
export type DestroyDatabaseMutationOptions = Apollo.BaseMutationOptions<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>;
export const LinkDatabaseDocument = gql`
    mutation linkDatabase($input: LinkDatabaseInput!) {
  linkDatabase(input: $input) {
    result
  }
}
    `;
export type LinkDatabaseMutationFn = Apollo.MutationFunction<LinkDatabaseMutation, LinkDatabaseMutationVariables>;

/**
 * __useLinkDatabaseMutation__
 *
 * To run a mutation, you first call `useLinkDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkDatabaseMutation, { data, loading, error }] = useLinkDatabaseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<LinkDatabaseMutation, LinkDatabaseMutationVariables>) {
        return Apollo.useMutation<LinkDatabaseMutation, LinkDatabaseMutationVariables>(LinkDatabaseDocument, baseOptions);
      }
export type LinkDatabaseMutationHookResult = ReturnType<typeof useLinkDatabaseMutation>;
export type LinkDatabaseMutationResult = Apollo.MutationResult<LinkDatabaseMutation>;
export type LinkDatabaseMutationOptions = Apollo.BaseMutationOptions<LinkDatabaseMutation, LinkDatabaseMutationVariables>;
export const LoginWithGithubDocument = gql`
    mutation loginWithGithub($code: String!) {
  loginWithGithub(code: $code) {
    token
  }
}
    `;
export type LoginWithGithubMutationFn = Apollo.MutationFunction<LoginWithGithubMutation, LoginWithGithubMutationVariables>;

/**
 * __useLoginWithGithubMutation__
 *
 * To run a mutation, you first call `useLoginWithGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithGithubMutation, { data, loading, error }] = useLoginWithGithubMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginWithGithubMutation(baseOptions?: Apollo.MutationHookOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>) {
        return Apollo.useMutation<LoginWithGithubMutation, LoginWithGithubMutationVariables>(LoginWithGithubDocument, baseOptions);
      }
export type LoginWithGithubMutationHookResult = ReturnType<typeof useLoginWithGithubMutation>;
export type LoginWithGithubMutationResult = Apollo.MutationResult<LoginWithGithubMutation>;
export type LoginWithGithubMutationOptions = Apollo.BaseMutationOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>;
export const RebuildAppDocument = gql`
    mutation rebuildApp($input: RebuildAppInput!) {
  rebuildApp(input: $input) {
    result
  }
}
    `;
export type RebuildAppMutationFn = Apollo.MutationFunction<RebuildAppMutation, RebuildAppMutationVariables>;

/**
 * __useRebuildAppMutation__
 *
 * To run a mutation, you first call `useRebuildAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRebuildAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rebuildAppMutation, { data, loading, error }] = useRebuildAppMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRebuildAppMutation(baseOptions?: Apollo.MutationHookOptions<RebuildAppMutation, RebuildAppMutationVariables>) {
        return Apollo.useMutation<RebuildAppMutation, RebuildAppMutationVariables>(RebuildAppDocument, baseOptions);
      }
export type RebuildAppMutationHookResult = ReturnType<typeof useRebuildAppMutation>;
export type RebuildAppMutationResult = Apollo.MutationResult<RebuildAppMutation>;
export type RebuildAppMutationOptions = Apollo.BaseMutationOptions<RebuildAppMutation, RebuildAppMutationVariables>;
export const RegisterGithubAppDocument = gql`
    mutation registerGithubApp($code: String!) {
  registerGithubApp(code: $code) {
    githubAppClientId
  }
}
    `;
export type RegisterGithubAppMutationFn = Apollo.MutationFunction<RegisterGithubAppMutation, RegisterGithubAppMutationVariables>;

/**
 * __useRegisterGithubAppMutation__
 *
 * To run a mutation, you first call `useRegisterGithubAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterGithubAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerGithubAppMutation, { data, loading, error }] = useRegisterGithubAppMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useRegisterGithubAppMutation(baseOptions?: Apollo.MutationHookOptions<RegisterGithubAppMutation, RegisterGithubAppMutationVariables>) {
        return Apollo.useMutation<RegisterGithubAppMutation, RegisterGithubAppMutationVariables>(RegisterGithubAppDocument, baseOptions);
      }
export type RegisterGithubAppMutationHookResult = ReturnType<typeof useRegisterGithubAppMutation>;
export type RegisterGithubAppMutationResult = Apollo.MutationResult<RegisterGithubAppMutation>;
export type RegisterGithubAppMutationOptions = Apollo.BaseMutationOptions<RegisterGithubAppMutation, RegisterGithubAppMutationVariables>;
export const RemoveAppProxyPortDocument = gql`
    mutation removeAppProxyPort($input: RemoveAppProxyPortInput!) {
  removeAppProxyPort(input: $input)
}
    `;
export type RemoveAppProxyPortMutationFn = Apollo.MutationFunction<RemoveAppProxyPortMutation, RemoveAppProxyPortMutationVariables>;

/**
 * __useRemoveAppProxyPortMutation__
 *
 * To run a mutation, you first call `useRemoveAppProxyPortMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAppProxyPortMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAppProxyPortMutation, { data, loading, error }] = useRemoveAppProxyPortMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveAppProxyPortMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAppProxyPortMutation, RemoveAppProxyPortMutationVariables>) {
        return Apollo.useMutation<RemoveAppProxyPortMutation, RemoveAppProxyPortMutationVariables>(RemoveAppProxyPortDocument, baseOptions);
      }
export type RemoveAppProxyPortMutationHookResult = ReturnType<typeof useRemoveAppProxyPortMutation>;
export type RemoveAppProxyPortMutationResult = Apollo.MutationResult<RemoveAppProxyPortMutation>;
export type RemoveAppProxyPortMutationOptions = Apollo.BaseMutationOptions<RemoveAppProxyPortMutation, RemoveAppProxyPortMutationVariables>;
export const RemoveDomainDocument = gql`
    mutation removeDomain($input: RemoveDomainInput!) {
  removeDomain(input: $input) {
    result
  }
}
    `;
export type RemoveDomainMutationFn = Apollo.MutationFunction<RemoveDomainMutation, RemoveDomainMutationVariables>;

/**
 * __useRemoveDomainMutation__
 *
 * To run a mutation, you first call `useRemoveDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDomainMutation, { data, loading, error }] = useRemoveDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveDomainMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDomainMutation, RemoveDomainMutationVariables>) {
        return Apollo.useMutation<RemoveDomainMutation, RemoveDomainMutationVariables>(RemoveDomainDocument, baseOptions);
      }
export type RemoveDomainMutationHookResult = ReturnType<typeof useRemoveDomainMutation>;
export type RemoveDomainMutationResult = Apollo.MutationResult<RemoveDomainMutation>;
export type RemoveDomainMutationOptions = Apollo.BaseMutationOptions<RemoveDomainMutation, RemoveDomainMutationVariables>;
export const RestartAppDocument = gql`
    mutation restartApp($input: RestartAppInput!) {
  restartApp(input: $input) {
    result
  }
}
    `;
export type RestartAppMutationFn = Apollo.MutationFunction<RestartAppMutation, RestartAppMutationVariables>;

/**
 * __useRestartAppMutation__
 *
 * To run a mutation, you first call `useRestartAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestartAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restartAppMutation, { data, loading, error }] = useRestartAppMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRestartAppMutation(baseOptions?: Apollo.MutationHookOptions<RestartAppMutation, RestartAppMutationVariables>) {
        return Apollo.useMutation<RestartAppMutation, RestartAppMutationVariables>(RestartAppDocument, baseOptions);
      }
export type RestartAppMutationHookResult = ReturnType<typeof useRestartAppMutation>;
export type RestartAppMutationResult = Apollo.MutationResult<RestartAppMutation>;
export type RestartAppMutationOptions = Apollo.BaseMutationOptions<RestartAppMutation, RestartAppMutationVariables>;
export const SetDomainDocument = gql`
    mutation setDomain($input: SetDomainInput!) {
  setDomain(input: $input) {
    result
  }
}
    `;
export type SetDomainMutationFn = Apollo.MutationFunction<SetDomainMutation, SetDomainMutationVariables>;

/**
 * __useSetDomainMutation__
 *
 * To run a mutation, you first call `useSetDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDomainMutation, { data, loading, error }] = useSetDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetDomainMutation(baseOptions?: Apollo.MutationHookOptions<SetDomainMutation, SetDomainMutationVariables>) {
        return Apollo.useMutation<SetDomainMutation, SetDomainMutationVariables>(SetDomainDocument, baseOptions);
      }
export type SetDomainMutationHookResult = ReturnType<typeof useSetDomainMutation>;
export type SetDomainMutationResult = Apollo.MutationResult<SetDomainMutation>;
export type SetDomainMutationOptions = Apollo.BaseMutationOptions<SetDomainMutation, SetDomainMutationVariables>;
export const SetEnvVarDocument = gql`
    mutation setEnvVar($key: String!, $value: String!, $appId: String!) {
  setEnvVar(input: {key: $key, value: $value, appId: $appId}) {
    result
  }
}
    `;
export type SetEnvVarMutationFn = Apollo.MutationFunction<SetEnvVarMutation, SetEnvVarMutationVariables>;

/**
 * __useSetEnvVarMutation__
 *
 * To run a mutation, you first call `useSetEnvVarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetEnvVarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setEnvVarMutation, { data, loading, error }] = useSetEnvVarMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value: // value for 'value'
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useSetEnvVarMutation(baseOptions?: Apollo.MutationHookOptions<SetEnvVarMutation, SetEnvVarMutationVariables>) {
        return Apollo.useMutation<SetEnvVarMutation, SetEnvVarMutationVariables>(SetEnvVarDocument, baseOptions);
      }
export type SetEnvVarMutationHookResult = ReturnType<typeof useSetEnvVarMutation>;
export type SetEnvVarMutationResult = Apollo.MutationResult<SetEnvVarMutation>;
export type SetEnvVarMutationOptions = Apollo.BaseMutationOptions<SetEnvVarMutation, SetEnvVarMutationVariables>;
export const UnlinkDatabaseDocument = gql`
    mutation unlinkDatabase($input: UnlinkDatabaseInput!) {
  unlinkDatabase(input: $input) {
    result
  }
}
    `;
export type UnlinkDatabaseMutationFn = Apollo.MutationFunction<UnlinkDatabaseMutation, UnlinkDatabaseMutationVariables>;

/**
 * __useUnlinkDatabaseMutation__
 *
 * To run a mutation, you first call `useUnlinkDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkDatabaseMutation, { data, loading, error }] = useUnlinkDatabaseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnlinkDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<UnlinkDatabaseMutation, UnlinkDatabaseMutationVariables>) {
        return Apollo.useMutation<UnlinkDatabaseMutation, UnlinkDatabaseMutationVariables>(UnlinkDatabaseDocument, baseOptions);
      }
export type UnlinkDatabaseMutationHookResult = ReturnType<typeof useUnlinkDatabaseMutation>;
export type UnlinkDatabaseMutationResult = Apollo.MutationResult<UnlinkDatabaseMutation>;
export type UnlinkDatabaseMutationOptions = Apollo.BaseMutationOptions<UnlinkDatabaseMutation, UnlinkDatabaseMutationVariables>;
export const UnsetEnvVarDocument = gql`
    mutation unsetEnvVar($key: String!, $appId: String!) {
  unsetEnvVar(input: {key: $key, appId: $appId}) {
    result
  }
}
    `;
export type UnsetEnvVarMutationFn = Apollo.MutationFunction<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>;

/**
 * __useUnsetEnvVarMutation__
 *
 * To run a mutation, you first call `useUnsetEnvVarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsetEnvVarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsetEnvVarMutation, { data, loading, error }] = useUnsetEnvVarMutation({
 *   variables: {
 *      key: // value for 'key'
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useUnsetEnvVarMutation(baseOptions?: Apollo.MutationHookOptions<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>) {
        return Apollo.useMutation<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>(UnsetEnvVarDocument, baseOptions);
      }
export type UnsetEnvVarMutationHookResult = ReturnType<typeof useUnsetEnvVarMutation>;
export type UnsetEnvVarMutationResult = Apollo.MutationResult<UnsetEnvVarMutation>;
export type UnsetEnvVarMutationOptions = Apollo.BaseMutationOptions<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>;
export const AppByIdDocument = gql`
    query appById($appId: String!) {
  app(appId: $appId) {
    id
    name
    createdAt
    databases {
      id
      name
      type
    }
    appMetaGithub {
      repoId
      repoName
      repoOwner
      branch
      githubAppInstallationId
    }
  }
}
    `;

/**
 * __useAppByIdQuery__
 *
 * To run a query within a React component, call `useAppByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppByIdQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useAppByIdQuery(baseOptions: Apollo.QueryHookOptions<AppByIdQuery, AppByIdQueryVariables>) {
        return Apollo.useQuery<AppByIdQuery, AppByIdQueryVariables>(AppByIdDocument, baseOptions);
      }
export function useAppByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppByIdQuery, AppByIdQueryVariables>) {
          return Apollo.useLazyQuery<AppByIdQuery, AppByIdQueryVariables>(AppByIdDocument, baseOptions);
        }
export type AppByIdQueryHookResult = ReturnType<typeof useAppByIdQuery>;
export type AppByIdLazyQueryHookResult = ReturnType<typeof useAppByIdLazyQuery>;
export type AppByIdQueryResult = Apollo.QueryResult<AppByIdQuery, AppByIdQueryVariables>;
export const AppLogsDocument = gql`
    query appLogs($appId: String!) {
  appLogs(appId: $appId) {
    logs
  }
}
    `;

/**
 * __useAppLogsQuery__
 *
 * To run a query within a React component, call `useAppLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppLogsQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useAppLogsQuery(baseOptions: Apollo.QueryHookOptions<AppLogsQuery, AppLogsQueryVariables>) {
        return Apollo.useQuery<AppLogsQuery, AppLogsQueryVariables>(AppLogsDocument, baseOptions);
      }
export function useAppLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppLogsQuery, AppLogsQueryVariables>) {
          return Apollo.useLazyQuery<AppLogsQuery, AppLogsQueryVariables>(AppLogsDocument, baseOptions);
        }
export type AppLogsQueryHookResult = ReturnType<typeof useAppLogsQuery>;
export type AppLogsLazyQueryHookResult = ReturnType<typeof useAppLogsLazyQuery>;
export type AppLogsQueryResult = Apollo.QueryResult<AppLogsQuery, AppLogsQueryVariables>;
export const AppProxyPortsDocument = gql`
    query appProxyPorts($appId: String!) {
  appProxyPorts(appId: $appId) {
    scheme
    host
    container
  }
}
    `;

/**
 * __useAppProxyPortsQuery__
 *
 * To run a query within a React component, call `useAppProxyPortsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppProxyPortsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppProxyPortsQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useAppProxyPortsQuery(baseOptions: Apollo.QueryHookOptions<AppProxyPortsQuery, AppProxyPortsQueryVariables>) {
        return Apollo.useQuery<AppProxyPortsQuery, AppProxyPortsQueryVariables>(AppProxyPortsDocument, baseOptions);
      }
export function useAppProxyPortsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppProxyPortsQuery, AppProxyPortsQueryVariables>) {
          return Apollo.useLazyQuery<AppProxyPortsQuery, AppProxyPortsQueryVariables>(AppProxyPortsDocument, baseOptions);
        }
export type AppProxyPortsQueryHookResult = ReturnType<typeof useAppProxyPortsQuery>;
export type AppProxyPortsLazyQueryHookResult = ReturnType<typeof useAppProxyPortsLazyQuery>;
export type AppProxyPortsQueryResult = Apollo.QueryResult<AppProxyPortsQuery, AppProxyPortsQueryVariables>;
export const AppsDocument = gql`
    query apps {
  apps {
    id
    name
  }
}
    `;

/**
 * __useAppsQuery__
 *
 * To run a query within a React component, call `useAppsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppsQuery(baseOptions?: Apollo.QueryHookOptions<AppsQuery, AppsQueryVariables>) {
        return Apollo.useQuery<AppsQuery, AppsQueryVariables>(AppsDocument, baseOptions);
      }
export function useAppsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppsQuery, AppsQueryVariables>) {
          return Apollo.useLazyQuery<AppsQuery, AppsQueryVariables>(AppsDocument, baseOptions);
        }
export type AppsQueryHookResult = ReturnType<typeof useAppsQuery>;
export type AppsLazyQueryHookResult = ReturnType<typeof useAppsLazyQuery>;
export type AppsQueryResult = Apollo.QueryResult<AppsQuery, AppsQueryVariables>;
export const BranchesDocument = gql`
    query branches($installationId: String!, $repositoryName: String!) {
  branches(installationId: $installationId, repositoryName: $repositoryName) {
    name
  }
}
    `;

/**
 * __useBranchesQuery__
 *
 * To run a query within a React component, call `useBranchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBranchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBranchesQuery({
 *   variables: {
 *      installationId: // value for 'installationId'
 *      repositoryName: // value for 'repositoryName'
 *   },
 * });
 */
export function useBranchesQuery(baseOptions: Apollo.QueryHookOptions<BranchesQuery, BranchesQueryVariables>) {
        return Apollo.useQuery<BranchesQuery, BranchesQueryVariables>(BranchesDocument, baseOptions);
      }
export function useBranchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BranchesQuery, BranchesQueryVariables>) {
          return Apollo.useLazyQuery<BranchesQuery, BranchesQueryVariables>(BranchesDocument, baseOptions);
        }
export type BranchesQueryHookResult = ReturnType<typeof useBranchesQuery>;
export type BranchesLazyQueryHookResult = ReturnType<typeof useBranchesLazyQuery>;
export type BranchesQueryResult = Apollo.QueryResult<BranchesQuery, BranchesQueryVariables>;
export const DashboardDocument = gql`
    query dashboard {
  apps {
    id
    name
    createdAt
    appMetaGithub {
      repoName
      repoOwner
    }
  }
  databases {
    id
    name
    type
    createdAt
  }
}
    `;

/**
 * __useDashboardQuery__
 *
 * To run a query within a React component, call `useDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardQuery({
 *   variables: {
 *   },
 * });
 */
export function useDashboardQuery(baseOptions?: Apollo.QueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
        return Apollo.useQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, baseOptions);
      }
export function useDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
          return Apollo.useLazyQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, baseOptions);
        }
export type DashboardQueryHookResult = ReturnType<typeof useDashboardQuery>;
export type DashboardLazyQueryHookResult = ReturnType<typeof useDashboardLazyQuery>;
export type DashboardQueryResult = Apollo.QueryResult<DashboardQuery, DashboardQueryVariables>;
export const DatabaseByIdDocument = gql`
    query databaseById($databaseId: String!) {
  database(databaseId: $databaseId) {
    id
    name
    type
    version
    apps {
      id
      name
    }
  }
}
    `;

/**
 * __useDatabaseByIdQuery__
 *
 * To run a query within a React component, call `useDatabaseByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatabaseByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatabaseByIdQuery({
 *   variables: {
 *      databaseId: // value for 'databaseId'
 *   },
 * });
 */
export function useDatabaseByIdQuery(baseOptions: Apollo.QueryHookOptions<DatabaseByIdQuery, DatabaseByIdQueryVariables>) {
        return Apollo.useQuery<DatabaseByIdQuery, DatabaseByIdQueryVariables>(DatabaseByIdDocument, baseOptions);
      }
export function useDatabaseByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseByIdQuery, DatabaseByIdQueryVariables>) {
          return Apollo.useLazyQuery<DatabaseByIdQuery, DatabaseByIdQueryVariables>(DatabaseByIdDocument, baseOptions);
        }
export type DatabaseByIdQueryHookResult = ReturnType<typeof useDatabaseByIdQuery>;
export type DatabaseByIdLazyQueryHookResult = ReturnType<typeof useDatabaseByIdLazyQuery>;
export type DatabaseByIdQueryResult = Apollo.QueryResult<DatabaseByIdQuery, DatabaseByIdQueryVariables>;
export const DatabaseInfoDocument = gql`
    query databaseInfo($databaseId: String!) {
  databaseInfo(databaseId: $databaseId) {
    info
  }
}
    `;

/**
 * __useDatabaseInfoQuery__
 *
 * To run a query within a React component, call `useDatabaseInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatabaseInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatabaseInfoQuery({
 *   variables: {
 *      databaseId: // value for 'databaseId'
 *   },
 * });
 */
export function useDatabaseInfoQuery(baseOptions: Apollo.QueryHookOptions<DatabaseInfoQuery, DatabaseInfoQueryVariables>) {
        return Apollo.useQuery<DatabaseInfoQuery, DatabaseInfoQueryVariables>(DatabaseInfoDocument, baseOptions);
      }
export function useDatabaseInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseInfoQuery, DatabaseInfoQueryVariables>) {
          return Apollo.useLazyQuery<DatabaseInfoQuery, DatabaseInfoQueryVariables>(DatabaseInfoDocument, baseOptions);
        }
export type DatabaseInfoQueryHookResult = ReturnType<typeof useDatabaseInfoQuery>;
export type DatabaseInfoLazyQueryHookResult = ReturnType<typeof useDatabaseInfoLazyQuery>;
export type DatabaseInfoQueryResult = Apollo.QueryResult<DatabaseInfoQuery, DatabaseInfoQueryVariables>;
export const DatabaseLogsDocument = gql`
    query databaseLogs($databaseId: String!) {
  databaseLogs(databaseId: $databaseId) {
    logs
  }
}
    `;

/**
 * __useDatabaseLogsQuery__
 *
 * To run a query within a React component, call `useDatabaseLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatabaseLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatabaseLogsQuery({
 *   variables: {
 *      databaseId: // value for 'databaseId'
 *   },
 * });
 */
export function useDatabaseLogsQuery(baseOptions: Apollo.QueryHookOptions<DatabaseLogsQuery, DatabaseLogsQueryVariables>) {
        return Apollo.useQuery<DatabaseLogsQuery, DatabaseLogsQueryVariables>(DatabaseLogsDocument, baseOptions);
      }
export function useDatabaseLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseLogsQuery, DatabaseLogsQueryVariables>) {
          return Apollo.useLazyQuery<DatabaseLogsQuery, DatabaseLogsQueryVariables>(DatabaseLogsDocument, baseOptions);
        }
export type DatabaseLogsQueryHookResult = ReturnType<typeof useDatabaseLogsQuery>;
export type DatabaseLogsLazyQueryHookResult = ReturnType<typeof useDatabaseLogsLazyQuery>;
export type DatabaseLogsQueryResult = Apollo.QueryResult<DatabaseLogsQuery, DatabaseLogsQueryVariables>;
export const DatabaseDocument = gql`
    query database {
  databases {
    id
    name
    type
  }
}
    `;

/**
 * __useDatabaseQuery__
 *
 * To run a query within a React component, call `useDatabaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatabaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatabaseQuery({
 *   variables: {
 *   },
 * });
 */
export function useDatabaseQuery(baseOptions?: Apollo.QueryHookOptions<DatabaseQuery, DatabaseQueryVariables>) {
        return Apollo.useQuery<DatabaseQuery, DatabaseQueryVariables>(DatabaseDocument, baseOptions);
      }
export function useDatabaseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseQuery, DatabaseQueryVariables>) {
          return Apollo.useLazyQuery<DatabaseQuery, DatabaseQueryVariables>(DatabaseDocument, baseOptions);
        }
export type DatabaseQueryHookResult = ReturnType<typeof useDatabaseQuery>;
export type DatabaseLazyQueryHookResult = ReturnType<typeof useDatabaseLazyQuery>;
export type DatabaseQueryResult = Apollo.QueryResult<DatabaseQuery, DatabaseQueryVariables>;
export const DomainsDocument = gql`
    query domains($appId: String!) {
  domains(appId: $appId) {
    domains
  }
}
    `;

/**
 * __useDomainsQuery__
 *
 * To run a query within a React component, call `useDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainsQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useDomainsQuery(baseOptions: Apollo.QueryHookOptions<DomainsQuery, DomainsQueryVariables>) {
        return Apollo.useQuery<DomainsQuery, DomainsQueryVariables>(DomainsDocument, baseOptions);
      }
export function useDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainsQuery, DomainsQueryVariables>) {
          return Apollo.useLazyQuery<DomainsQuery, DomainsQueryVariables>(DomainsDocument, baseOptions);
        }
export type DomainsQueryHookResult = ReturnType<typeof useDomainsQuery>;
export type DomainsLazyQueryHookResult = ReturnType<typeof useDomainsLazyQuery>;
export type DomainsQueryResult = Apollo.QueryResult<DomainsQuery, DomainsQueryVariables>;
export const EnvVarsDocument = gql`
    query envVars($appId: String!) {
  envVars(appId: $appId) {
    envVars {
      key
      value
    }
  }
}
    `;

/**
 * __useEnvVarsQuery__
 *
 * To run a query within a React component, call `useEnvVarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnvVarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnvVarsQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useEnvVarsQuery(baseOptions: Apollo.QueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
        return Apollo.useQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, baseOptions);
      }
export function useEnvVarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
          return Apollo.useLazyQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, baseOptions);
        }
export type EnvVarsQueryHookResult = ReturnType<typeof useEnvVarsQuery>;
export type EnvVarsLazyQueryHookResult = ReturnType<typeof useEnvVarsLazyQuery>;
export type EnvVarsQueryResult = Apollo.QueryResult<EnvVarsQuery, EnvVarsQueryVariables>;
export const GithubInstallationIdDocument = gql`
    query githubInstallationId {
  githubInstallationId {
    id
  }
}
    `;

/**
 * __useGithubInstallationIdQuery__
 *
 * To run a query within a React component, call `useGithubInstallationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGithubInstallationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGithubInstallationIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGithubInstallationIdQuery(baseOptions?: Apollo.QueryHookOptions<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>) {
        return Apollo.useQuery<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>(GithubInstallationIdDocument, baseOptions);
      }
export function useGithubInstallationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>) {
          return Apollo.useLazyQuery<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>(GithubInstallationIdDocument, baseOptions);
        }
export type GithubInstallationIdQueryHookResult = ReturnType<typeof useGithubInstallationIdQuery>;
export type GithubInstallationIdLazyQueryHookResult = ReturnType<typeof useGithubInstallationIdLazyQuery>;
export type GithubInstallationIdQueryResult = Apollo.QueryResult<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>;
export const IsPluginInstalledDocument = gql`
    query isPluginInstalled($pluginName: String!) {
  isPluginInstalled(pluginName: $pluginName) {
    isPluginInstalled
  }
}
    `;

/**
 * __useIsPluginInstalledQuery__
 *
 * To run a query within a React component, call `useIsPluginInstalledQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsPluginInstalledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsPluginInstalledQuery({
 *   variables: {
 *      pluginName: // value for 'pluginName'
 *   },
 * });
 */
export function useIsPluginInstalledQuery(baseOptions: Apollo.QueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
        return Apollo.useQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, baseOptions);
      }
export function useIsPluginInstalledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
          return Apollo.useLazyQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, baseOptions);
        }
export type IsPluginInstalledQueryHookResult = ReturnType<typeof useIsPluginInstalledQuery>;
export type IsPluginInstalledLazyQueryHookResult = ReturnType<typeof useIsPluginInstalledLazyQuery>;
export type IsPluginInstalledQueryResult = Apollo.QueryResult<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>;
export const RepositoriesDocument = gql`
    query repositories($installationId: String!) {
  repositories(installationId: $installationId) {
    id
    name
    fullName
    private
  }
}
    `;

/**
 * __useRepositoriesQuery__
 *
 * To run a query within a React component, call `useRepositoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRepositoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRepositoriesQuery({
 *   variables: {
 *      installationId: // value for 'installationId'
 *   },
 * });
 */
export function useRepositoriesQuery(baseOptions: Apollo.QueryHookOptions<RepositoriesQuery, RepositoriesQueryVariables>) {
        return Apollo.useQuery<RepositoriesQuery, RepositoriesQueryVariables>(RepositoriesDocument, baseOptions);
      }
export function useRepositoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RepositoriesQuery, RepositoriesQueryVariables>) {
          return Apollo.useLazyQuery<RepositoriesQuery, RepositoriesQueryVariables>(RepositoriesDocument, baseOptions);
        }
export type RepositoriesQueryHookResult = ReturnType<typeof useRepositoriesQuery>;
export type RepositoriesLazyQueryHookResult = ReturnType<typeof useRepositoriesLazyQuery>;
export type RepositoriesQueryResult = Apollo.QueryResult<RepositoriesQuery, RepositoriesQueryVariables>;
export const SetupDocument = gql`
    query setup {
  setup {
    canConnectSsh
    sshPublicKey
    isGithubAppSetup
    githubAppManifest
  }
}
    `;

/**
 * __useSetupQuery__
 *
 * To run a query within a React component, call `useSetupQuery` and pass it any options that fit your needs.
 * When your component renders, `useSetupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSetupQuery({
 *   variables: {
 *   },
 * });
 */
export function useSetupQuery(baseOptions?: Apollo.QueryHookOptions<SetupQuery, SetupQueryVariables>) {
        return Apollo.useQuery<SetupQuery, SetupQueryVariables>(SetupDocument, baseOptions);
      }
export function useSetupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SetupQuery, SetupQueryVariables>) {
          return Apollo.useLazyQuery<SetupQuery, SetupQueryVariables>(SetupDocument, baseOptions);
        }
export type SetupQueryHookResult = ReturnType<typeof useSetupQuery>;
export type SetupLazyQueryHookResult = ReturnType<typeof useSetupLazyQuery>;
export type SetupQueryResult = Apollo.QueryResult<SetupQuery, SetupQueryVariables>;
export const UserDocument = gql`
    query user {
  user {
    userName
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const AppCreateLogsDocument = gql`
    subscription appCreateLogs {
  appCreateLogs {
    message
    type
  }
}
    `;

/**
 * __useAppCreateLogsSubscription__
 *
 * To run a query within a React component, call `useAppCreateLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAppCreateLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppCreateLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useAppCreateLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<AppCreateLogsSubscription, AppCreateLogsSubscriptionVariables>) {
        return Apollo.useSubscription<AppCreateLogsSubscription, AppCreateLogsSubscriptionVariables>(AppCreateLogsDocument, baseOptions);
      }
export type AppCreateLogsSubscriptionHookResult = ReturnType<typeof useAppCreateLogsSubscription>;
export type AppCreateLogsSubscriptionResult = Apollo.SubscriptionResult<AppCreateLogsSubscription>;
export const CreateDatabaseLogsDocument = gql`
    subscription CreateDatabaseLogs {
  createDatabaseLogs {
    message
    type
  }
}
    `;

/**
 * __useCreateDatabaseLogsSubscription__
 *
 * To run a query within a React component, call `useCreateDatabaseLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCreateDatabaseLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateDatabaseLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCreateDatabaseLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CreateDatabaseLogsSubscription, CreateDatabaseLogsSubscriptionVariables>) {
        return Apollo.useSubscription<CreateDatabaseLogsSubscription, CreateDatabaseLogsSubscriptionVariables>(CreateDatabaseLogsDocument, baseOptions);
      }
export type CreateDatabaseLogsSubscriptionHookResult = ReturnType<typeof useCreateDatabaseLogsSubscription>;
export type CreateDatabaseLogsSubscriptionResult = Apollo.SubscriptionResult<CreateDatabaseLogsSubscription>;
export const LinkDatabaseLogsDocument = gql`
    subscription LinkDatabaseLogs {
  linkDatabaseLogs {
    message
    type
  }
}
    `;

/**
 * __useLinkDatabaseLogsSubscription__
 *
 * To run a query within a React component, call `useLinkDatabaseLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLinkDatabaseLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLinkDatabaseLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useLinkDatabaseLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<LinkDatabaseLogsSubscription, LinkDatabaseLogsSubscriptionVariables>) {
        return Apollo.useSubscription<LinkDatabaseLogsSubscription, LinkDatabaseLogsSubscriptionVariables>(LinkDatabaseLogsDocument, baseOptions);
      }
export type LinkDatabaseLogsSubscriptionHookResult = ReturnType<typeof useLinkDatabaseLogsSubscription>;
export type LinkDatabaseLogsSubscriptionResult = Apollo.SubscriptionResult<LinkDatabaseLogsSubscription>;
export const AppRebuildLogsDocument = gql`
    subscription appRebuildLogs {
  appRebuildLogs {
    message
    type
  }
}
    `;

/**
 * __useAppRebuildLogsSubscription__
 *
 * To run a query within a React component, call `useAppRebuildLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAppRebuildLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppRebuildLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useAppRebuildLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<AppRebuildLogsSubscription, AppRebuildLogsSubscriptionVariables>) {
        return Apollo.useSubscription<AppRebuildLogsSubscription, AppRebuildLogsSubscriptionVariables>(AppRebuildLogsDocument, baseOptions);
      }
export type AppRebuildLogsSubscriptionHookResult = ReturnType<typeof useAppRebuildLogsSubscription>;
export type AppRebuildLogsSubscriptionResult = Apollo.SubscriptionResult<AppRebuildLogsSubscription>;
export const AppRestartLogsDocument = gql`
    subscription appRestartLogs {
  appRestartLogs {
    message
    type
  }
}
    `;

/**
 * __useAppRestartLogsSubscription__
 *
 * To run a query within a React component, call `useAppRestartLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAppRestartLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppRestartLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useAppRestartLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<AppRestartLogsSubscription, AppRestartLogsSubscriptionVariables>) {
        return Apollo.useSubscription<AppRestartLogsSubscription, AppRestartLogsSubscriptionVariables>(AppRestartLogsDocument, baseOptions);
      }
export type AppRestartLogsSubscriptionHookResult = ReturnType<typeof useAppRestartLogsSubscription>;
export type AppRestartLogsSubscriptionResult = Apollo.SubscriptionResult<AppRestartLogsSubscription>;
export const UnlinkDatabaseLogsDocument = gql`
    subscription UnlinkDatabaseLogs {
  unlinkDatabaseLogs {
    message
    type
  }
}
    `;

/**
 * __useUnlinkDatabaseLogsSubscription__
 *
 * To run a query within a React component, call `useUnlinkDatabaseLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUnlinkDatabaseLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnlinkDatabaseLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUnlinkDatabaseLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UnlinkDatabaseLogsSubscription, UnlinkDatabaseLogsSubscriptionVariables>) {
        return Apollo.useSubscription<UnlinkDatabaseLogsSubscription, UnlinkDatabaseLogsSubscriptionVariables>(UnlinkDatabaseLogsDocument, baseOptions);
      }
export type UnlinkDatabaseLogsSubscriptionHookResult = ReturnType<typeof useUnlinkDatabaseLogsSubscription>;
export type UnlinkDatabaseLogsSubscriptionResult = Apollo.SubscriptionResult<UnlinkDatabaseLogsSubscription>;