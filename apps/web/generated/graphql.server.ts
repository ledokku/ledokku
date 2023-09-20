import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  DateTime: any;
};

export type Activity = {
  __typename?: 'Activity';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  modifier?: Maybe<User>;
  name: Scalars['String'];
  reference?: Maybe<ActivityModelUnion>;
  updatedAt: Scalars['DateTime'];
};

export type ActivityModelUnion = App | AppBuild | Database;

export type ActivityPaginationInfo = {
  __typename?: 'ActivityPaginationInfo';
  items: Array<Activity>;
  nextPage?: Maybe<Scalars['Int']>;
  page: Scalars['Int'];
  prevPage?: Maybe<Scalars['Int']>;
  totalItems: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type AddAppProxyPortInput = {
  appId: Scalars['String'];
  container: Scalars['String'];
  host: Scalars['String'];
};

export type AddDomainInput = {
  appId: Scalars['String'];
  domainName: Scalars['String'];
};

export type App = {
  __typename?: 'App';
  appMetaGithub?: Maybe<AppGithubMeta>;
  createdAt: Scalars['DateTime'];
  databases: Array<Database>;
  dockerfilePath?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  logs: Logs;
  name: Scalars['String'];
  ports: Array<ProxyPort>;
  status: AppStatus;
  tags: Array<Tag>;
  type: AppTypes;
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type AppBuild = {
  __typename?: 'AppBuild';
  app: App;
  appId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  status: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
  userId?: Maybe<Scalars['ID']>;
};

export type AppDomain = {
  __typename?: 'AppDomain';
  domain: Scalars['String'];
};

export type AppGithubMeta = {
  __typename?: 'AppGithubMeta';
  appId: Scalars['String'];
  branch: Scalars['String'];
  createdAt: Scalars['DateTime'];
  githubAppInstallationId: Scalars['String'];
  id: Scalars['String'];
  repoId: Scalars['String'];
  repoName: Scalars['String'];
  repoOwner: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type AppPaginationInfo = {
  __typename?: 'AppPaginationInfo';
  items: Array<App>;
  nextPage?: Maybe<Scalars['Int']>;
  page: Scalars['Int'];
  prevPage?: Maybe<Scalars['Int']>;
  totalItems: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export enum AppStatus {
  Building = 'BUILDING',
  Idle = 'IDLE',
  Running = 'RUNNING'
}

export enum AppTypes {
  Docker = 'DOCKER',
  Dokku = 'DOKKU',
  Github = 'GITHUB',
  Gitlab = 'GITLAB'
}

export type Auth = {
  __typename?: 'Auth';
  token: Scalars['String'];
};

export type BooleanResult = {
  __typename?: 'BooleanResult';
  result: Scalars['Boolean'];
};

export type Branch = {
  __typename?: 'Branch';
  name: Scalars['String'];
};

export type BuildEnvVar = {
  asBuildArg?: InputMaybe<Scalars['Boolean']>;
  key: Scalars['String'];
  value: Scalars['String'];
};

export type CreateAppDokkuInput = {
  name: Scalars['String'];
};

export type CreateAppGithubInput = {
  branchName: Scalars['String'];
  dockerfilePath?: InputMaybe<Scalars['String']>;
  envVars?: InputMaybe<Array<BuildEnvVar>>;
  githubInstallationId: Scalars['String'];
  gitRepoFullName: Scalars['String'];
  gitRepoId: Scalars['String'];
  name: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateAppResult = {
  __typename?: 'CreateAppResult';
  appId: Scalars['String'];
};

export type CreateDatabaseInput = {
  image?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']>>;
  type: DbTypes;
  version?: InputMaybe<Scalars['String']>;
};

export type Database = {
  __typename?: 'Database';
  apps: Array<App>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  tags: Array<Tag>;
  type: DbTypes;
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
  version: Scalars['String'];
};

export type DatabaseInfo = {
  __typename?: 'DatabaseInfo';
  info: Array<Scalars['String']>;
};

export type DatabasePaginationInfo = {
  __typename?: 'DatabasePaginationInfo';
  items: Array<Database>;
  nextPage?: Maybe<Scalars['Int']>;
  page: Scalars['Int'];
  prevPage?: Maybe<Scalars['Int']>;
  totalItems: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export enum DbTypes {
  Mariadb = 'MARIADB',
  Mongodb = 'MONGODB',
  Mysql = 'MYSQL',
  Postgresql = 'POSTGRESQL',
  Redis = 'REDIS'
}

export type DestroyAppInput = {
  appId: Scalars['String'];
};

export type DestroyDatabaseInput = {
  databaseId: Scalars['String'];
};

export type EnvVar = {
  __typename?: 'EnvVar';
  asBuildArg: Scalars['Boolean'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type EnvVarList = {
  __typename?: 'EnvVarList';
  envVars: Array<EnvVar>;
};

export type GithubAuthInput = {
  access_token: Scalars['String'];
  expires_at: Scalars['Int'];
  provider: Scalars['String'];
  providerAccountId: Scalars['String'];
  refresh_token: Scalars['String'];
  refresh_token_expires_in: Scalars['Int'];
  token_type: Scalars['String'];
  type: Scalars['String'];
};

export type Installation = {
  __typename?: 'Installation';
  id: Scalars['ID'];
};

export type IsDatabaseLinked = {
  __typename?: 'IsDatabaseLinked';
  isLinked: Scalars['String'];
};

export type IsPluginInstalled = {
  __typename?: 'IsPluginInstalled';
  isPluginInstalled: Scalars['Boolean'];
};

export type LinkDatabaseInput = {
  appId: Scalars['String'];
  databaseId: Scalars['String'];
};

export type LogPayload = {
  __typename?: 'LogPayload';
  message: Scalars['String'];
  type: Scalars['String'];
};

export type Logs = {
  __typename?: 'Logs';
  logs: Array<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAllowedEmail: Scalars['String'];
  addAppProxyPort: Scalars['Boolean'];
  addDomain: BooleanResult;
  changeBranch: Scalars['Boolean'];
  createAppDokku: CreateAppResult;
  createAppGithub: App;
  createDatabase: BooleanResult;
  destroyApp: BooleanResult;
  destroyDatabase: BooleanResult;
  linkDatabase: BooleanResult;
  loginWithGithub: Auth;
  loginWithGithubAccessToken: Auth;
  rebuildApp: BooleanResult;
  removeAllowedEmail: Scalars['String'];
  removeAppProxyPort: Scalars['Boolean'];
  removeDomain: BooleanResult;
  restartApp: BooleanResult;
  setAppTags: App;
  setDatabaseTags: Database;
  setDomain: BooleanResult;
  setEnvVar: BooleanResult;
  unlinkDatabase: BooleanResult;
  unsetEnvVar: BooleanResult;
};


export type MutationAddAllowedEmailArgs = {
  email: Scalars['String'];
};


export type MutationAddAppProxyPortArgs = {
  input: AddAppProxyPortInput;
};


export type MutationAddDomainArgs = {
  input: AddDomainInput;
};


export type MutationChangeBranchArgs = {
  input: UpdateBranchInput;
};


export type MutationCreateAppDokkuArgs = {
  input: CreateAppDokkuInput;
};


export type MutationCreateAppGithubArgs = {
  input: CreateAppGithubInput;
};


export type MutationCreateDatabaseArgs = {
  input: CreateDatabaseInput;
};


export type MutationDestroyAppArgs = {
  input: DestroyAppInput;
};


export type MutationDestroyDatabaseArgs = {
  input: DestroyDatabaseInput;
};


export type MutationLinkDatabaseArgs = {
  input: LinkDatabaseInput;
};


export type MutationLoginWithGithubArgs = {
  code: Scalars['String'];
};


export type MutationLoginWithGithubAccessTokenArgs = {
  input: GithubAuthInput;
};


export type MutationRebuildAppArgs = {
  input: RebuildAppInput;
};


export type MutationRemoveAllowedEmailArgs = {
  email: Scalars['String'];
};


export type MutationRemoveAppProxyPortArgs = {
  input: RemoveAppProxyPortInput;
};


export type MutationRemoveDomainArgs = {
  input: RemoveDomainInput;
};


export type MutationRestartAppArgs = {
  input: RestartAppInput;
};


export type MutationSetAppTagsArgs = {
  input: TagUpdateInput;
};


export type MutationSetDatabaseTagsArgs = {
  input: TagUpdateInput;
};


export type MutationSetDomainArgs = {
  input: SetDomainInput;
};


export type MutationSetEnvVarArgs = {
  input: SetEnvVarInput;
};


export type MutationUnlinkDatabaseArgs = {
  input: UnlinkDatabaseInput;
};


export type MutationUnsetEnvVarArgs = {
  input: UnsetEnvVarInput;
};

export type Plugin = {
  __typename?: 'Plugin';
  name: Scalars['String'];
  version: Scalars['String'];
};

export type PluginList = {
  __typename?: 'PluginList';
  plugins: Array<Plugin>;
  version: Scalars['String'];
};

export type ProxyPort = {
  __typename?: 'ProxyPort';
  container: Scalars['String'];
  host: Scalars['String'];
  scheme: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  activity: ActivityPaginationInfo;
  allTags: Array<Tag>;
  app: App;
  appLogs: Logs;
  appMetaGithub?: Maybe<AppGithubMeta>;
  appProxyPorts: Array<ProxyPort>;
  apps: AppPaginationInfo;
  appsWithTag: AppPaginationInfo;
  branches: Array<Branch>;
  buildingApps: Array<App>;
  checkDomainStatus: Scalars['Int'];
  createLogs: Array<LogPayload>;
  database: Database;
  databaseInfo: DatabaseInfo;
  databaseLogs: Logs;
  databases: DatabasePaginationInfo;
  databasesWithTag: DatabasePaginationInfo;
  dokkuPlugins: PluginList;
  domains: Array<AppDomain>;
  envVars: EnvVarList;
  githubInstallationId: Installation;
  isDatabaseLinked: IsDatabaseLinked;
  isPluginInstalled: IsPluginInstalled;
  ledokkuLogs: Array<LogPayload>;
  plugins: Array<Plugin>;
  repositories: Array<Repository>;
  settings: Settings;
  setup: SetupResult;
};


export type QueryActivityArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  refId?: InputMaybe<Scalars['String']>;
};


export type QueryAppArgs = {
  appId: Scalars['String'];
};


export type QueryAppLogsArgs = {
  appId: Scalars['String'];
};


export type QueryAppMetaGithubArgs = {
  appId: Scalars['String'];
};


export type QueryAppProxyPortsArgs = {
  appId: Scalars['String'];
};


export type QueryAppsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryAppsWithTagArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryBranchesArgs = {
  installationId: Scalars['String'];
  repositoryName: Scalars['String'];
};


export type QueryCheckDomainStatusArgs = {
  url: Scalars['String'];
};


export type QueryCreateLogsArgs = {
  appId: Scalars['ID'];
};


export type QueryDatabaseArgs = {
  databaseId: Scalars['String'];
};


export type QueryDatabaseInfoArgs = {
  databaseId: Scalars['String'];
};


export type QueryDatabaseLogsArgs = {
  databaseId: Scalars['String'];
};


export type QueryDatabasesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryDatabasesWithTagArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
};


export type QueryDomainsArgs = {
  appId: Scalars['String'];
};


export type QueryEnvVarsArgs = {
  appId: Scalars['String'];
};


export type QueryIsDatabaseLinkedArgs = {
  appId: Scalars['String'];
  databaseId: Scalars['String'];
};


export type QueryIsPluginInstalledArgs = {
  pluginName: Scalars['String'];
};


export type QueryRepositoriesArgs = {
  installationId: Scalars['String'];
};

export type RebuildAppInput = {
  appId: Scalars['String'];
};

export type RemoveAppProxyPortInput = {
  appId: Scalars['String'];
  container: Scalars['String'];
  host: Scalars['String'];
  scheme: Scalars['String'];
};

export type RemoveDomainInput = {
  appId: Scalars['String'];
  domainName: Scalars['String'];
};

export type Repository = {
  __typename?: 'Repository';
  fullName: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  private: Scalars['String'];
};

export type RestartAppInput = {
  appId: Scalars['String'];
};

export enum Roles {
  Admin = 'ADMIN',
  Owner = 'OWNER'
}

export type SetDomainInput = {
  appId: Scalars['String'];
  domainName: Scalars['String'];
};

export type SetEnvVarInput = {
  appId: Scalars['String'];
  asBuildArg?: InputMaybe<Scalars['Boolean']>;
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Settings = {
  __typename?: 'Settings';
  allowedEmails: Array<Scalars['String']>;
  allowedUsers: Array<User>;
  id: Scalars['ID'];
};

export type SetupResult = {
  __typename?: 'SetupResult';
  canConnectSsh: Scalars['Boolean'];
  githubAppManifest: Scalars['String'];
  isGithubAppSetup: Scalars['Boolean'];
  sshPublicKey: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  appCreateLogs: LogPayload;
  appRebuildLogs: LogPayload;
  appRestartLogs: LogPayload;
  createDatabaseLogs: LogPayload;
  linkDatabaseLogs: LogPayload;
  onLedokkuLog: LogPayload;
  unlinkDatabaseLogs: LogPayload;
};


export type SubscriptionAppCreateLogsArgs = {
  appId: Scalars['ID'];
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type TagUpdateInput = {
  id: Scalars['ID'];
  tags: Array<Scalars['String']>;
};

export type UnlinkDatabaseInput = {
  appId: Scalars['String'];
  databaseId: Scalars['String'];
};

export type UnsetEnvVarInput = {
  appId: Scalars['String'];
  key: Scalars['String'];
};

export type UpdateBranchInput = {
  appId: Scalars['ID'];
  branchName: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  githubAccessToken: Scalars['String'];
  githubId: Scalars['String'];
  id: Scalars['ID'];
  refreshToken: Scalars['String'];
  refreshTokenExpiresAt: Scalars['DateTime'];
  role: Roles;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type AddAllowedUserMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type AddAllowedUserMutation = { __typename?: 'Mutation', addAllowedEmail: string };

export type AddAppProxyPortMutationVariables = Exact<{
  input: AddAppProxyPortInput;
}>;


export type AddAppProxyPortMutation = { __typename?: 'Mutation', addAppProxyPort: boolean };

export type AddDomainMutationVariables = Exact<{
  input: AddDomainInput;
}>;


export type AddDomainMutation = { __typename?: 'Mutation', addDomain: { __typename?: 'BooleanResult', result: boolean } };

export type ChangeAppBranchMutationVariables = Exact<{
  input: UpdateBranchInput;
}>;


export type ChangeAppBranchMutation = { __typename?: 'Mutation', changeBranch: boolean };

export type CreateAppDokkuMutationVariables = Exact<{
  input: CreateAppDokkuInput;
}>;


export type CreateAppDokkuMutation = { __typename?: 'Mutation', createAppDokku: { __typename?: 'CreateAppResult', appId: string } };

export type CreateAppGithubMutationVariables = Exact<{
  input: CreateAppGithubInput;
}>;


export type CreateAppGithubMutation = { __typename?: 'Mutation', createAppGithub: { __typename?: 'App', id: string } };

export type CreateDatabaseMutationVariables = Exact<{
  input: CreateDatabaseInput;
}>;


export type CreateDatabaseMutation = { __typename?: 'Mutation', createDatabase: { __typename?: 'BooleanResult', result: boolean } };

export type DestroyAppMutationVariables = Exact<{
  input: DestroyAppInput;
}>;


export type DestroyAppMutation = { __typename?: 'Mutation', destroyApp: { __typename?: 'BooleanResult', result: boolean } };

export type DestroyDatabaseMutationVariables = Exact<{
  input: DestroyDatabaseInput;
}>;


export type DestroyDatabaseMutation = { __typename?: 'Mutation', destroyDatabase: { __typename?: 'BooleanResult', result: boolean } };

export type LinkDatabaseMutationVariables = Exact<{
  input: LinkDatabaseInput;
}>;


export type LinkDatabaseMutation = { __typename?: 'Mutation', linkDatabase: { __typename?: 'BooleanResult', result: boolean } };

export type LoginWithGithubMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type LoginWithGithubMutation = { __typename?: 'Mutation', loginWithGithub: { __typename?: 'Auth', token: string } };

export type LoginWithGithubAccessTokenMutationVariables = Exact<{
  input: GithubAuthInput;
}>;


export type LoginWithGithubAccessTokenMutation = { __typename?: 'Mutation', loginWithGithubAccessToken: { __typename?: 'Auth', token: string } };

export type RebuildAppMutationVariables = Exact<{
  input: RebuildAppInput;
}>;


export type RebuildAppMutation = { __typename?: 'Mutation', rebuildApp: { __typename?: 'BooleanResult', result: boolean } };

export type RemoveAllowedUserMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type RemoveAllowedUserMutation = { __typename?: 'Mutation', removeAllowedEmail: string };

export type RemoveAppProxyPortMutationVariables = Exact<{
  input: RemoveAppProxyPortInput;
}>;


export type RemoveAppProxyPortMutation = { __typename?: 'Mutation', removeAppProxyPort: boolean };

export type RemoveDomainMutationVariables = Exact<{
  input: RemoveDomainInput;
}>;


export type RemoveDomainMutation = { __typename?: 'Mutation', removeDomain: { __typename?: 'BooleanResult', result: boolean } };

export type RestartAppMutationVariables = Exact<{
  input: RestartAppInput;
}>;


export type RestartAppMutation = { __typename?: 'Mutation', restartApp: { __typename?: 'BooleanResult', result: boolean } };

export type SetAppTagsMutationVariables = Exact<{
  input: TagUpdateInput;
}>;


export type SetAppTagsMutation = { __typename?: 'Mutation', setAppTags: { __typename?: 'App', id: string } };

export type SetDatabaseTagsMutationVariables = Exact<{
  input: TagUpdateInput;
}>;


export type SetDatabaseTagsMutation = { __typename?: 'Mutation', setDatabaseTags: { __typename?: 'Database', id: string } };

export type SetDomainMutationVariables = Exact<{
  input: SetDomainInput;
}>;


export type SetDomainMutation = { __typename?: 'Mutation', setDomain: { __typename?: 'BooleanResult', result: boolean } };

export type SetEnvVarMutationVariables = Exact<{
  input: SetEnvVarInput;
}>;


export type SetEnvVarMutation = { __typename?: 'Mutation', setEnvVar: { __typename?: 'BooleanResult', result: boolean } };

export type UnlinkDatabaseMutationVariables = Exact<{
  input: UnlinkDatabaseInput;
}>;


export type UnlinkDatabaseMutation = { __typename?: 'Mutation', unlinkDatabase: { __typename?: 'BooleanResult', result: boolean } };

export type UnsetEnvVarMutationVariables = Exact<{
  key: Scalars['String'];
  appId: Scalars['String'];
}>;


export type UnsetEnvVarMutation = { __typename?: 'Mutation', unsetEnvVar: { __typename?: 'BooleanResult', result: boolean } };

export type ActivityQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  refId?: InputMaybe<Scalars['String']>;
}>;


export type ActivityQuery = { __typename?: 'Query', activity: { __typename?: 'ActivityPaginationInfo', nextPage?: number | null, prevPage?: number | null, totalItems: number, totalPages: number, items: Array<{ __typename?: 'Activity', name: string, description?: string | null, createdAt: any, modifier?: { __typename?: 'User', username: string, avatarUrl: string } | null, reference?: { __typename?: 'App', id: string, name: string, type: AppTypes, appMetaGithub?: { __typename?: 'AppGithubMeta', repoOwner: string, repoName: string } | null } | { __typename?: 'AppBuild', status: string, buildId: string } | { __typename?: 'Database', name: string, version: string, dbId: string, dbType: DbTypes } | null }> } };

export type AllowedUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllowedUsersQuery = { __typename?: 'Query', settings: { __typename?: 'Settings', allowedEmails: Array<string>, allowedUsers: Array<{ __typename?: 'User', id: string, username: string, avatarUrl: string, email: string }> } };

export type AppByIdQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AppByIdQuery = { __typename?: 'Query', app: { __typename?: 'App', id: string, name: string, createdAt: any, status: AppStatus, tags: Array<{ __typename?: 'Tag', name: string }>, databases: Array<{ __typename?: 'Database', id: string, name: string, type: DbTypes }>, appMetaGithub?: { __typename?: 'AppGithubMeta', repoId: string, repoName: string, repoOwner: string, branch: string, githubAppInstallationId: string } | null, ports: Array<{ __typename?: 'ProxyPort', scheme: string, host: string, container: string }> } };

export type AppLogsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AppLogsQuery = { __typename?: 'Query', appLogs: { __typename?: 'Logs', logs: Array<string> } };

export type AppProxyPortsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AppProxyPortsQuery = { __typename?: 'Query', appProxyPorts: Array<{ __typename?: 'ProxyPort', scheme: string, host: string, container: string }> };

export type AppsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type AppsQuery = { __typename?: 'Query', apps: { __typename?: 'AppPaginationInfo', totalPages: number, items: Array<{ __typename?: 'App', id: string, name: string, type: AppTypes, status: AppStatus, tags: Array<{ __typename?: 'Tag', name: string }>, appMetaGithub?: { __typename?: 'AppGithubMeta', repoOwner: string, repoName: string } | null, ports: Array<{ __typename?: 'ProxyPort', scheme: string, host: string, container: string }> }> } };

export type BranchesQueryVariables = Exact<{
  installationId: Scalars['String'];
  repositoryName: Scalars['String'];
}>;


export type BranchesQuery = { __typename?: 'Query', branches: Array<{ __typename?: 'Branch', name: string }> };

export type CheckDomainStatusQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type CheckDomainStatusQuery = { __typename?: 'Query', checkDomainStatus: number };

export type DashboardQueryVariables = Exact<{
  appLimit?: InputMaybe<Scalars['Int']>;
  databaseLimit?: InputMaybe<Scalars['Int']>;
  appPage?: InputMaybe<Scalars['Int']>;
  databasePage?: InputMaybe<Scalars['Int']>;
}>;


export type DashboardQuery = { __typename?: 'Query', apps: { __typename?: 'AppPaginationInfo', totalPages: number, items: Array<{ __typename?: 'App', id: string, name: string, createdAt: any, appMetaGithub?: { __typename?: 'AppGithubMeta', repoName: string, repoOwner: string } | null }> }, databases: { __typename?: 'DatabasePaginationInfo', totalPages: number, items: Array<{ __typename?: 'Database', id: string, name: string, type: DbTypes, createdAt: any }> } };

export type DatabaseByIdQueryVariables = Exact<{
  databaseId: Scalars['String'];
}>;


export type DatabaseByIdQuery = { __typename?: 'Query', database: { __typename?: 'Database', id: string, name: string, type: DbTypes, version: string, tags: Array<{ __typename?: 'Tag', name: string }>, apps: Array<{ __typename?: 'App', id: string, name: string }> } };

export type DatabaseInfoQueryVariables = Exact<{
  databaseId: Scalars['String'];
}>;


export type DatabaseInfoQuery = { __typename?: 'Query', databaseInfo: { __typename?: 'DatabaseInfo', info: Array<string> } };

export type DatabaseLogsQueryVariables = Exact<{
  databaseId: Scalars['String'];
}>;


export type DatabaseLogsQuery = { __typename?: 'Query', databaseLogs: { __typename?: 'Logs', logs: Array<string> } };

export type DatabaseQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type DatabaseQuery = { __typename?: 'Query', databases: { __typename?: 'DatabasePaginationInfo', totalPages: number, items: Array<{ __typename?: 'Database', id: string, name: string, type: DbTypes, version: string, tags: Array<{ __typename?: 'Tag', name: string }> }> } };

export type DomainsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type DomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'AppDomain', domain: string }> };

export type EnvVarsQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type EnvVarsQuery = { __typename?: 'Query', envVars: { __typename?: 'EnvVarList', envVars: Array<{ __typename?: 'EnvVar', key: string, value: string, asBuildArg: boolean }> } };

export type GetBuildingAppsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingAppsQuery = { __typename?: 'Query', buildingApps: Array<{ __typename?: 'App', id: string, name: string, status: AppStatus }> };

export type GetCreateLogsQueryVariables = Exact<{
  appId: Scalars['ID'];
}>;


export type GetCreateLogsQuery = { __typename?: 'Query', createLogs: Array<{ __typename?: 'LogPayload', message: string, type: string }> };

export type GithubInstallationIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GithubInstallationIdQuery = { __typename?: 'Query', githubInstallationId: { __typename?: 'Installation', id: string } };

export type IsPluginInstalledQueryVariables = Exact<{
  pluginName: Scalars['String'];
}>;


export type IsPluginInstalledQuery = { __typename?: 'Query', isPluginInstalled: { __typename?: 'IsPluginInstalled', isPluginInstalled: boolean } };

export type LedokkuLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type LedokkuLogsQuery = { __typename?: 'Query', ledokkuLogs: Array<{ __typename?: 'LogPayload', message: string, type: string }> };

export type PluginsQueryVariables = Exact<{ [key: string]: never; }>;


export type PluginsQuery = { __typename?: 'Query', plugins: Array<{ __typename?: 'Plugin', name: string, version: string }> };

export type RepositoriesQueryVariables = Exact<{
  installationId: Scalars['String'];
}>;


export type RepositoriesQuery = { __typename?: 'Query', repositories: Array<{ __typename?: 'Repository', id: string, name: string, fullName: string, private: string }> };

export type SetupQueryVariables = Exact<{ [key: string]: never; }>;


export type SetupQuery = { __typename?: 'Query', setup: { __typename?: 'SetupResult', canConnectSsh: boolean, sshPublicKey: string, isGithubAppSetup: boolean, githubAppManifest: string } };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', allTags: Array<{ __typename?: 'Tag', name: string }> };

export type AppCreateLogsSubscriptionVariables = Exact<{
  appId: Scalars['ID'];
}>;


export type AppCreateLogsSubscription = { __typename?: 'Subscription', appCreateLogs: { __typename?: 'LogPayload', message: string, type: string } };

export type CreateDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CreateDatabaseLogsSubscription = { __typename?: 'Subscription', createDatabaseLogs: { __typename?: 'LogPayload', message: string, type: string } };

export type OnLedokkuLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnLedokkuLogsSubscription = { __typename?: 'Subscription', onLedokkuLog: { __typename?: 'LogPayload', message: string, type: string } };

export type LinkDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LinkDatabaseLogsSubscription = { __typename?: 'Subscription', linkDatabaseLogs: { __typename?: 'LogPayload', message: string, type: string } };

export type AppRebuildLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AppRebuildLogsSubscription = { __typename?: 'Subscription', appRebuildLogs: { __typename?: 'LogPayload', message: string, type: string } };

export type AppRestartLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AppRestartLogsSubscription = { __typename?: 'Subscription', appRestartLogs: { __typename?: 'LogPayload', message: string, type: string } };

export type UnlinkDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UnlinkDatabaseLogsSubscription = { __typename?: 'Subscription', unlinkDatabaseLogs: { __typename?: 'LogPayload', message: string, type: string } };


export const AddAllowedUserDocument = gql`
    mutation addAllowedUser($email: String!) {
  addAllowedEmail(email: $email)
}
    `;
export const AddAppProxyPortDocument = gql`
    mutation addAppProxyPort($input: AddAppProxyPortInput!) {
  addAppProxyPort(input: $input)
}
    `;
export const AddDomainDocument = gql`
    mutation addDomain($input: AddDomainInput!) {
  addDomain(input: $input) {
    result
  }
}
    `;
export const ChangeAppBranchDocument = gql`
    mutation ChangeAppBranch($input: UpdateBranchInput!) {
  changeBranch(input: $input)
}
    `;
export const CreateAppDokkuDocument = gql`
    mutation createAppDokku($input: CreateAppDokkuInput!) {
  createAppDokku(input: $input) {
    appId
  }
}
    `;
export const CreateAppGithubDocument = gql`
    mutation createAppGithub($input: CreateAppGithubInput!) {
  createAppGithub(input: $input) {
    id
  }
}
    `;
export const CreateDatabaseDocument = gql`
    mutation createDatabase($input: CreateDatabaseInput!) {
  createDatabase(input: $input) {
    result
  }
}
    `;
export const DestroyAppDocument = gql`
    mutation destroyApp($input: DestroyAppInput!) {
  destroyApp(input: $input) {
    result
  }
}
    `;
export const DestroyDatabaseDocument = gql`
    mutation destroyDatabase($input: DestroyDatabaseInput!) {
  destroyDatabase(input: $input) {
    result
  }
}
    `;
export const LinkDatabaseDocument = gql`
    mutation linkDatabase($input: LinkDatabaseInput!) {
  linkDatabase(input: $input) {
    result
  }
}
    `;
export const LoginWithGithubDocument = gql`
    mutation loginWithGithub($code: String!) {
  loginWithGithub(code: $code) {
    token
  }
}
    `;
export const LoginWithGithubAccessTokenDocument = gql`
    mutation loginWithGithubAccessToken($input: GithubAuthInput!) {
  loginWithGithubAccessToken(input: $input) {
    token
  }
}
    `;
export const RebuildAppDocument = gql`
    mutation rebuildApp($input: RebuildAppInput!) {
  rebuildApp(input: $input) {
    result
  }
}
    `;
export const RemoveAllowedUserDocument = gql`
    mutation removeAllowedUser($email: String!) {
  removeAllowedEmail(email: $email)
}
    `;
export const RemoveAppProxyPortDocument = gql`
    mutation removeAppProxyPort($input: RemoveAppProxyPortInput!) {
  removeAppProxyPort(input: $input)
}
    `;
export const RemoveDomainDocument = gql`
    mutation removeDomain($input: RemoveDomainInput!) {
  removeDomain(input: $input) {
    result
  }
}
    `;
export const RestartAppDocument = gql`
    mutation restartApp($input: RestartAppInput!) {
  restartApp(input: $input) {
    result
  }
}
    `;
export const SetAppTagsDocument = gql`
    mutation SetAppTags($input: TagUpdateInput!) {
  setAppTags(input: $input) {
    id
  }
}
    `;
export const SetDatabaseTagsDocument = gql`
    mutation SetDatabaseTags($input: TagUpdateInput!) {
  setDatabaseTags(input: $input) {
    id
  }
}
    `;
export const SetDomainDocument = gql`
    mutation setDomain($input: SetDomainInput!) {
  setDomain(input: $input) {
    result
  }
}
    `;
export const SetEnvVarDocument = gql`
    mutation setEnvVar($input: SetEnvVarInput!) {
  setEnvVar(input: $input) {
    result
  }
}
    `;
export const UnlinkDatabaseDocument = gql`
    mutation unlinkDatabase($input: UnlinkDatabaseInput!) {
  unlinkDatabase(input: $input) {
    result
  }
}
    `;
export const UnsetEnvVarDocument = gql`
    mutation unsetEnvVar($key: String!, $appId: String!) {
  unsetEnvVar(input: {key: $key, appId: $appId}) {
    result
  }
}
    `;
export const ActivityDocument = gql`
    query Activity($page: Int, $limit: Int, $refId: String) {
  activity(limit: $limit, page: $page, refId: $refId) {
    nextPage
    prevPage
    totalItems
    totalPages
    items {
      name
      description
      createdAt
      modifier {
        username
        avatarUrl
      }
      reference {
        ... on App {
          id
          name
          type
          appMetaGithub {
            repoOwner
            repoName
          }
        }
        ... on AppBuild {
          buildId: id
          status
        }
        ... on Database {
          dbId: id
          name
          dbType: type
          version
        }
      }
    }
  }
}
    `;
export const AllowedUsersDocument = gql`
    query allowedUsers {
  settings {
    allowedEmails
    allowedUsers {
      id
      username
      avatarUrl
      email
    }
  }
}
    `;
export const AppByIdDocument = gql`
    query appById($appId: String!) {
  app(appId: $appId) {
    id
    name
    createdAt
    status
    tags {
      name
    }
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
    ports {
      scheme
      host
      container
    }
  }
}
    `;
export const AppLogsDocument = gql`
    query appLogs($appId: String!) {
  appLogs(appId: $appId) {
    logs
  }
}
    `;
export const AppProxyPortsDocument = gql`
    query appProxyPorts($appId: String!) {
  appProxyPorts(appId: $appId) {
    scheme
    host
    container
  }
}
    `;
export const AppsDocument = gql`
    query apps($limit: Int, $page: Int, $tags: [String!]) {
  apps(limit: $limit, page: $page, tags: $tags) {
    items {
      id
      name
      type
      tags {
        name
      }
      appMetaGithub {
        repoOwner
        repoName
      }
      ports {
        scheme
        host
        container
      }
      status
    }
    totalPages
  }
}
    `;
export const BranchesDocument = gql`
    query branches($installationId: String!, $repositoryName: String!) {
  branches(installationId: $installationId, repositoryName: $repositoryName) {
    name
  }
}
    `;
export const CheckDomainStatusDocument = gql`
    query CheckDomainStatus($url: String!) {
  checkDomainStatus(url: $url)
}
    `;
export const DashboardDocument = gql`
    query dashboard($appLimit: Int, $databaseLimit: Int, $appPage: Int, $databasePage: Int) {
  apps(limit: $appLimit, page: $appPage) {
    items {
      id
      name
      createdAt
      appMetaGithub {
        repoName
        repoOwner
      }
    }
    totalPages
  }
  databases(limit: $databaseLimit, page: $databasePage) {
    items {
      id
      name
      type
      createdAt
    }
    totalPages
  }
}
    `;
export const DatabaseByIdDocument = gql`
    query databaseById($databaseId: String!) {
  database(databaseId: $databaseId) {
    id
    name
    type
    version
    tags {
      name
    }
    apps {
      id
      name
    }
  }
}
    `;
export const DatabaseInfoDocument = gql`
    query databaseInfo($databaseId: String!) {
  databaseInfo(databaseId: $databaseId) {
    info
  }
}
    `;
export const DatabaseLogsDocument = gql`
    query databaseLogs($databaseId: String!) {
  databaseLogs(databaseId: $databaseId) {
    logs
  }
}
    `;
export const DatabaseDocument = gql`
    query database($limit: Int, $page: Int, $tags: [String!]) {
  databases(limit: $limit, page: $page, tags: $tags) {
    items {
      id
      name
      type
      version
      tags {
        name
      }
    }
    totalPages
  }
}
    `;
export const DomainsDocument = gql`
    query domains($appId: String!) {
  domains(appId: $appId) {
    domain
  }
}
    `;
export const EnvVarsDocument = gql`
    query envVars($appId: String!) {
  envVars(appId: $appId) {
    envVars {
      key
      value
      asBuildArg
    }
  }
}
    `;
export const GetBuildingAppsDocument = gql`
    query GetBuildingApps {
  buildingApps {
    id
    name
    status
  }
}
    `;
export const GetCreateLogsDocument = gql`
    query GetCreateLogs($appId: ID!) {
  createLogs(appId: $appId) {
    message
    type
  }
}
    `;
export const GithubInstallationIdDocument = gql`
    query githubInstallationId {
  githubInstallationId {
    id
  }
}
    `;
export const IsPluginInstalledDocument = gql`
    query isPluginInstalled($pluginName: String!) {
  isPluginInstalled(pluginName: $pluginName) {
    isPluginInstalled
  }
}
    `;
export const LedokkuLogsDocument = gql`
    query LedokkuLogs {
  ledokkuLogs {
    message
    type
  }
}
    `;
export const PluginsDocument = gql`
    query plugins {
  plugins {
    name
    version
  }
}
    `;
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
export const GetAllTagsDocument = gql`
    query GetAllTags {
  allTags {
    name
  }
}
    `;
export const AppCreateLogsDocument = gql`
    subscription appCreateLogs($appId: ID!) {
  appCreateLogs(appId: $appId) {
    message
    type
  }
}
    `;
export const CreateDatabaseLogsDocument = gql`
    subscription CreateDatabaseLogs {
  createDatabaseLogs {
    message
    type
  }
}
    `;
export const OnLedokkuLogsDocument = gql`
    subscription OnLedokkuLogs {
  onLedokkuLog {
    message
    type
  }
}
    `;
export const LinkDatabaseLogsDocument = gql`
    subscription LinkDatabaseLogs {
  linkDatabaseLogs {
    message
    type
  }
}
    `;
export const AppRebuildLogsDocument = gql`
    subscription appRebuildLogs {
  appRebuildLogs {
    message
    type
  }
}
    `;
export const AppRestartLogsDocument = gql`
    subscription appRestartLogs {
  appRestartLogs {
    message
    type
  }
}
    `;
export const UnlinkDatabaseLogsDocument = gql`
    subscription UnlinkDatabaseLogs {
  unlinkDatabaseLogs {
    message
    type
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addAllowedUser(variables: AddAllowedUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddAllowedUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddAllowedUserMutation>(AddAllowedUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addAllowedUser', 'mutation');
    },
    addAppProxyPort(variables: AddAppProxyPortMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddAppProxyPortMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddAppProxyPortMutation>(AddAppProxyPortDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addAppProxyPort', 'mutation');
    },
    addDomain(variables: AddDomainMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AddDomainMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddDomainMutation>(AddDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addDomain', 'mutation');
    },
    ChangeAppBranch(variables: ChangeAppBranchMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ChangeAppBranchMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ChangeAppBranchMutation>(ChangeAppBranchDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ChangeAppBranch', 'mutation');
    },
    createAppDokku(variables: CreateAppDokkuMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateAppDokkuMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateAppDokkuMutation>(CreateAppDokkuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createAppDokku', 'mutation');
    },
    createAppGithub(variables: CreateAppGithubMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateAppGithubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateAppGithubMutation>(CreateAppGithubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createAppGithub', 'mutation');
    },
    createDatabase(variables: CreateDatabaseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateDatabaseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDatabaseMutation>(CreateDatabaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createDatabase', 'mutation');
    },
    destroyApp(variables: DestroyAppMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DestroyAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DestroyAppMutation>(DestroyAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'destroyApp', 'mutation');
    },
    destroyDatabase(variables: DestroyDatabaseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DestroyDatabaseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DestroyDatabaseMutation>(DestroyDatabaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'destroyDatabase', 'mutation');
    },
    linkDatabase(variables: LinkDatabaseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LinkDatabaseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LinkDatabaseMutation>(LinkDatabaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'linkDatabase', 'mutation');
    },
    loginWithGithub(variables: LoginWithGithubMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginWithGithubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginWithGithubMutation>(LoginWithGithubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loginWithGithub', 'mutation');
    },
    loginWithGithubAccessToken(variables: LoginWithGithubAccessTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginWithGithubAccessTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginWithGithubAccessTokenMutation>(LoginWithGithubAccessTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'loginWithGithubAccessToken', 'mutation');
    },
    rebuildApp(variables: RebuildAppMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RebuildAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RebuildAppMutation>(RebuildAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'rebuildApp', 'mutation');
    },
    removeAllowedUser(variables: RemoveAllowedUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveAllowedUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveAllowedUserMutation>(RemoveAllowedUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeAllowedUser', 'mutation');
    },
    removeAppProxyPort(variables: RemoveAppProxyPortMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveAppProxyPortMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveAppProxyPortMutation>(RemoveAppProxyPortDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeAppProxyPort', 'mutation');
    },
    removeDomain(variables: RemoveDomainMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RemoveDomainMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveDomainMutation>(RemoveDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeDomain', 'mutation');
    },
    restartApp(variables: RestartAppMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RestartAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RestartAppMutation>(RestartAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'restartApp', 'mutation');
    },
    SetAppTags(variables: SetAppTagsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetAppTagsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetAppTagsMutation>(SetAppTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SetAppTags', 'mutation');
    },
    SetDatabaseTags(variables: SetDatabaseTagsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetDatabaseTagsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetDatabaseTagsMutation>(SetDatabaseTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SetDatabaseTags', 'mutation');
    },
    setDomain(variables: SetDomainMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetDomainMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetDomainMutation>(SetDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setDomain', 'mutation');
    },
    setEnvVar(variables: SetEnvVarMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetEnvVarMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetEnvVarMutation>(SetEnvVarDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setEnvVar', 'mutation');
    },
    unlinkDatabase(variables: UnlinkDatabaseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UnlinkDatabaseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnlinkDatabaseMutation>(UnlinkDatabaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unlinkDatabase', 'mutation');
    },
    unsetEnvVar(variables: UnsetEnvVarMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UnsetEnvVarMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnsetEnvVarMutation>(UnsetEnvVarDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unsetEnvVar', 'mutation');
    },
    Activity(variables?: ActivityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ActivityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivityQuery>(ActivityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Activity', 'query');
    },
    allowedUsers(variables?: AllowedUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllowedUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllowedUsersQuery>(AllowedUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allowedUsers', 'query');
    },
    appById(variables: AppByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppByIdQuery>(AppByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appById', 'query');
    },
    appLogs(variables: AppLogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppLogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppLogsQuery>(AppLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appLogs', 'query');
    },
    appProxyPorts(variables: AppProxyPortsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppProxyPortsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppProxyPortsQuery>(AppProxyPortsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appProxyPorts', 'query');
    },
    apps(variables?: AppsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppsQuery>(AppsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'apps', 'query');
    },
    branches(variables: BranchesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BranchesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BranchesQuery>(BranchesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'branches', 'query');
    },
    CheckDomainStatus(variables: CheckDomainStatusQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CheckDomainStatusQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckDomainStatusQuery>(CheckDomainStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CheckDomainStatus', 'query');
    },
    dashboard(variables?: DashboardQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DashboardQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DashboardQuery>(DashboardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'dashboard', 'query');
    },
    databaseById(variables: DatabaseByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DatabaseByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DatabaseByIdQuery>(DatabaseByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'databaseById', 'query');
    },
    databaseInfo(variables: DatabaseInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DatabaseInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DatabaseInfoQuery>(DatabaseInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'databaseInfo', 'query');
    },
    databaseLogs(variables: DatabaseLogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DatabaseLogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DatabaseLogsQuery>(DatabaseLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'databaseLogs', 'query');
    },
    database(variables?: DatabaseQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DatabaseQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DatabaseQuery>(DatabaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'database', 'query');
    },
    domains(variables: DomainsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DomainsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DomainsQuery>(DomainsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'domains', 'query');
    },
    envVars(variables: EnvVarsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<EnvVarsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EnvVarsQuery>(EnvVarsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'envVars', 'query');
    },
    GetBuildingApps(variables?: GetBuildingAppsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBuildingAppsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBuildingAppsQuery>(GetBuildingAppsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetBuildingApps', 'query');
    },
    GetCreateLogs(variables: GetCreateLogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCreateLogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCreateLogsQuery>(GetCreateLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetCreateLogs', 'query');
    },
    githubInstallationId(variables?: GithubInstallationIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GithubInstallationIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GithubInstallationIdQuery>(GithubInstallationIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'githubInstallationId', 'query');
    },
    isPluginInstalled(variables: IsPluginInstalledQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<IsPluginInstalledQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsPluginInstalledQuery>(IsPluginInstalledDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'isPluginInstalled', 'query');
    },
    LedokkuLogs(variables?: LedokkuLogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LedokkuLogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LedokkuLogsQuery>(LedokkuLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'LedokkuLogs', 'query');
    },
    plugins(variables?: PluginsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PluginsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PluginsQuery>(PluginsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'plugins', 'query');
    },
    repositories(variables: RepositoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RepositoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RepositoriesQuery>(RepositoriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'repositories', 'query');
    },
    setup(variables?: SetupQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetupQuery>(SetupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setup', 'query');
    },
    GetAllTags(variables?: GetAllTagsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAllTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllTagsQuery>(GetAllTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAllTags', 'query');
    },
    appCreateLogs(variables: AppCreateLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppCreateLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppCreateLogsSubscription>(AppCreateLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appCreateLogs', 'subscription');
    },
    CreateDatabaseLogs(variables?: CreateDatabaseLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateDatabaseLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDatabaseLogsSubscription>(CreateDatabaseLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateDatabaseLogs', 'subscription');
    },
    OnLedokkuLogs(variables?: OnLedokkuLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OnLedokkuLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<OnLedokkuLogsSubscription>(OnLedokkuLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OnLedokkuLogs', 'subscription');
    },
    LinkDatabaseLogs(variables?: LinkDatabaseLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LinkDatabaseLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<LinkDatabaseLogsSubscription>(LinkDatabaseLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'LinkDatabaseLogs', 'subscription');
    },
    appRebuildLogs(variables?: AppRebuildLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppRebuildLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppRebuildLogsSubscription>(AppRebuildLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appRebuildLogs', 'subscription');
    },
    appRestartLogs(variables?: AppRestartLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AppRestartLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppRestartLogsSubscription>(AppRestartLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appRestartLogs', 'subscription');
    },
    UnlinkDatabaseLogs(variables?: UnlinkDatabaseLogsSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UnlinkDatabaseLogsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnlinkDatabaseLogsSubscription>(UnlinkDatabaseLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UnlinkDatabaseLogs', 'subscription');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;