import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Activity = {
  __typename?: 'Activity';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  modifier?: Maybe<User>;
  name: Scalars['String']['output'];
  reference?: Maybe<ActivityModelUnion>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ActivityModelUnion = App | AppBuild | Database;

export type ActivityPaginationInfo = {
  __typename?: 'ActivityPaginationInfo';
  items: Array<Activity>;
  nextPage?: Maybe<Scalars['Int']['output']>;
  page: Scalars['Int']['output'];
  prevPage?: Maybe<Scalars['Int']['output']>;
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type AddAppProxyPortInput = {
  appId: Scalars['String']['input'];
  container: Scalars['String']['input'];
  host: Scalars['String']['input'];
};

export type AddDomainInput = {
  appId: Scalars['String']['input'];
  domainName: Scalars['String']['input'];
};

export type App = {
  __typename?: 'App';
  appMetaGithub?: Maybe<AppGithubMeta>;
  createdAt: Scalars['DateTime']['output'];
  databases: Array<Database>;
  dockerfilePath?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  logs: Logs;
  name: Scalars['String']['output'];
  ports: Array<ProxyPort>;
  status: AppStatus;
  tags: Array<Tag>;
  type: AppTypes;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type AppBuild = {
  __typename?: 'AppBuild';
  app: App;
  appId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  status: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['ID']['output']>;
};

export type AppDomain = {
  __typename?: 'AppDomain';
  domain: Scalars['String']['output'];
};

export type AppGithubMeta = {
  __typename?: 'AppGithubMeta';
  appId: Scalars['String']['output'];
  branch: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  githubAppInstallationId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  repoId: Scalars['String']['output'];
  repoName: Scalars['String']['output'];
  repoOwner: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AppPaginationInfo = {
  __typename?: 'AppPaginationInfo';
  items: Array<App>;
  nextPage?: Maybe<Scalars['Int']['output']>;
  page: Scalars['Int']['output'];
  prevPage?: Maybe<Scalars['Int']['output']>;
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
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
  token: Scalars['String']['output'];
};

export type BooleanResult = {
  __typename?: 'BooleanResult';
  result: Scalars['Boolean']['output'];
};

export type Branch = {
  __typename?: 'Branch';
  name: Scalars['String']['output'];
};

export type BuildEnvVar = {
  asBuildArg?: InputMaybe<Scalars['Boolean']['input']>;
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CreateAppDokkuInput = {
  name: Scalars['String']['input'];
};

export type CreateAppGithubInput = {
  branchName: Scalars['String']['input'];
  dockerfilePath?: InputMaybe<Scalars['String']['input']>;
  envVars?: InputMaybe<Array<BuildEnvVar>>;
  githubInstallationId: Scalars['String']['input'];
  gitRepoFullName: Scalars['String']['input'];
  gitRepoId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateAppResult = {
  __typename?: 'CreateAppResult';
  appId: Scalars['String']['output'];
};

export type CreateDatabaseInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  type: DbTypes;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type Database = {
  __typename?: 'Database';
  apps: Array<App>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tags: Array<Tag>;
  type: DbTypes;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
  version?: Maybe<Scalars['String']['output']>;
};

export type DatabaseInfo = {
  __typename?: 'DatabaseInfo';
  info: Array<Scalars['String']['output']>;
};

export type DatabasePaginationInfo = {
  __typename?: 'DatabasePaginationInfo';
  items: Array<Database>;
  nextPage?: Maybe<Scalars['Int']['output']>;
  page: Scalars['Int']['output'];
  prevPage?: Maybe<Scalars['Int']['output']>;
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export enum DbTypes {
  Mariadb = 'MARIADB',
  Mongodb = 'MONGODB',
  Mysql = 'MYSQL',
  Postgresql = 'POSTGRESQL',
  Redis = 'REDIS'
}

export type DestroyAppInput = {
  appId: Scalars['String']['input'];
};

export type DestroyDatabaseInput = {
  databaseId: Scalars['String']['input'];
};

export type EnvVar = {
  __typename?: 'EnvVar';
  asBuildArg: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type EnvVarList = {
  __typename?: 'EnvVarList';
  envVars: Array<EnvVar>;
};

export type GithubAuthInput = {
  access_token: Scalars['String']['input'];
  expires_at: Scalars['Int']['input'];
  provider: Scalars['String']['input'];
  providerAccountId: Scalars['String']['input'];
  refresh_token: Scalars['String']['input'];
  refresh_token_expires_in: Scalars['Int']['input'];
  token_type: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type Installation = {
  __typename?: 'Installation';
  id: Scalars['ID']['output'];
};

export type IsDatabaseLinked = {
  __typename?: 'IsDatabaseLinked';
  isLinked: Scalars['String']['output'];
};

export type IsPluginInstalled = {
  __typename?: 'IsPluginInstalled';
  isPluginInstalled: Scalars['Boolean']['output'];
};

export type LinkDatabaseInput = {
  appId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
};

export type LogPayload = {
  __typename?: 'LogPayload';
  message: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Logs = {
  __typename?: 'Logs';
  logs: Array<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAllowedEmail: Scalars['String']['output'];
  addAppProxyPort: Scalars['Boolean']['output'];
  addDomain: BooleanResult;
  changeBranch: Scalars['Boolean']['output'];
  createAppDokku: CreateAppResult;
  createAppGithub: App;
  createDatabase: Database;
  destroyApp: BooleanResult;
  destroyDatabase: BooleanResult;
  linkDatabase: BooleanResult;
  loginWithGithub: Auth;
  loginWithGithubAccessToken: Auth;
  rebuildApp: BooleanResult;
  removeAllowedEmail: Scalars['String']['output'];
  removeAppProxyPort: Scalars['Boolean']['output'];
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
  email: Scalars['String']['input'];
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
  code: Scalars['String']['input'];
};


export type MutationLoginWithGithubAccessTokenArgs = {
  input: GithubAuthInput;
};


export type MutationRebuildAppArgs = {
  input: RebuildAppInput;
};


export type MutationRemoveAllowedEmailArgs = {
  email: Scalars['String']['input'];
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
  name: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type PluginList = {
  __typename?: 'PluginList';
  plugins: Array<Plugin>;
  version: Scalars['String']['output'];
};

export type ProxyPort = {
  __typename?: 'ProxyPort';
  container: Scalars['String']['output'];
  host: Scalars['String']['output'];
  scheme: Scalars['String']['output'];
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
  checkDomainStatus: Scalars['Int']['output'];
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  refId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAppArgs = {
  appId: Scalars['String']['input'];
};


export type QueryAppLogsArgs = {
  appId: Scalars['String']['input'];
};


export type QueryAppMetaGithubArgs = {
  appId: Scalars['String']['input'];
};


export type QueryAppProxyPortsArgs = {
  appId: Scalars['String']['input'];
};


export type QueryAppsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryAppsWithTagArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBranchesArgs = {
  installationId: Scalars['String']['input'];
  repositoryName: Scalars['String']['input'];
};


export type QueryCheckDomainStatusArgs = {
  url: Scalars['String']['input'];
};


export type QueryCreateLogsArgs = {
  appId: Scalars['ID']['input'];
};


export type QueryDatabaseArgs = {
  databaseId: Scalars['String']['input'];
};


export type QueryDatabaseInfoArgs = {
  databaseId: Scalars['String']['input'];
};


export type QueryDatabaseLogsArgs = {
  databaseId: Scalars['String']['input'];
};


export type QueryDatabasesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryDatabasesWithTagArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDomainsArgs = {
  appId: Scalars['String']['input'];
};


export type QueryEnvVarsArgs = {
  appId: Scalars['String']['input'];
};


export type QueryIsDatabaseLinkedArgs = {
  appId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
};


export type QueryIsPluginInstalledArgs = {
  pluginName: Scalars['String']['input'];
};


export type QueryRepositoriesArgs = {
  installationId: Scalars['String']['input'];
};

export type RebuildAppInput = {
  appId: Scalars['String']['input'];
};

export type RemoveAppProxyPortInput = {
  appId: Scalars['String']['input'];
  container: Scalars['String']['input'];
  host: Scalars['String']['input'];
  scheme: Scalars['String']['input'];
};

export type RemoveDomainInput = {
  appId: Scalars['String']['input'];
  domainName: Scalars['String']['input'];
};

export type Repository = {
  __typename?: 'Repository';
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  private: Scalars['String']['output'];
};

export type RestartAppInput = {
  appId: Scalars['String']['input'];
};

export enum Roles {
  Admin = 'ADMIN',
  Owner = 'OWNER'
}

export type SetDomainInput = {
  appId: Scalars['String']['input'];
  domainName: Scalars['String']['input'];
};

export type SetEnvVarInput = {
  appId: Scalars['String']['input'];
  asBuildArg?: InputMaybe<Scalars['Boolean']['input']>;
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Settings = {
  __typename?: 'Settings';
  allowedEmails: Array<Scalars['String']['output']>;
  allowedUsers: Array<User>;
  id: Scalars['ID']['output'];
};

export type SetupResult = {
  __typename?: 'SetupResult';
  canConnectSsh: Scalars['Boolean']['output'];
  githubAppManifest: Scalars['String']['output'];
  isGithubAppSetup: Scalars['Boolean']['output'];
  sshPublicKey: Scalars['String']['output'];
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
  appId: Scalars['ID']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TagUpdateInput = {
  id: Scalars['ID']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type UnlinkDatabaseInput = {
  appId: Scalars['String']['input'];
  databaseId: Scalars['String']['input'];
};

export type UnsetEnvVarInput = {
  appId: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type UpdateBranchInput = {
  appId: Scalars['ID']['input'];
  branchName: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  githubAccessToken: Scalars['String']['output'];
  githubId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  refreshToken: Scalars['String']['output'];
  refreshTokenExpiresAt: Scalars['DateTime']['output'];
  role: Roles;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type AddAllowedUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
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


export type CreateDatabaseMutation = { __typename?: 'Mutation', createDatabase: { __typename?: 'Database', id: string } };

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
  code: Scalars['String']['input'];
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
  email: Scalars['String']['input'];
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
  key: Scalars['String']['input'];
  appId: Scalars['String']['input'];
}>;


export type UnsetEnvVarMutation = { __typename?: 'Mutation', unsetEnvVar: { __typename?: 'BooleanResult', result: boolean } };

export type ActivityQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  refId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ActivityQuery = { __typename?: 'Query', activity: { __typename?: 'ActivityPaginationInfo', nextPage?: number | null, prevPage?: number | null, totalItems: number, totalPages: number, items: Array<{ __typename?: 'Activity', name: string, description?: string | null, createdAt: any, modifier?: { __typename?: 'User', username: string, avatarUrl: string } | null, reference?: { __typename?: 'App', id: string, name: string, type: AppTypes, appMetaGithub?: { __typename?: 'AppGithubMeta', repoOwner: string, repoName: string } | null } | { __typename?: 'AppBuild', status: string, buildId: string } | { __typename?: 'Database', name: string, version?: string | null, dbId: string, dbType: DbTypes } | null }> } };

export type AllowedUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllowedUsersQuery = { __typename?: 'Query', settings: { __typename?: 'Settings', allowedEmails: Array<string>, allowedUsers: Array<{ __typename?: 'User', id: string, username: string, avatarUrl: string, email: string }> } };

export type AppByIdQueryVariables = Exact<{
  appId: Scalars['String']['input'];
}>;


export type AppByIdQuery = { __typename?: 'Query', app: { __typename?: 'App', id: string, name: string, createdAt: any, status: AppStatus, tags: Array<{ __typename?: 'Tag', name: string }>, databases: Array<{ __typename?: 'Database', id: string, name: string, type: DbTypes }>, appMetaGithub?: { __typename?: 'AppGithubMeta', repoId: string, repoName: string, repoOwner: string, branch: string, githubAppInstallationId: string } | null, ports: Array<{ __typename?: 'ProxyPort', scheme: string, host: string, container: string }> } };

export type AppLogsQueryVariables = Exact<{
  appId: Scalars['String']['input'];
}>;


export type AppLogsQuery = { __typename?: 'Query', appLogs: { __typename?: 'Logs', logs: Array<string> } };

export type AppProxyPortsQueryVariables = Exact<{
  appId: Scalars['String']['input'];
}>;


export type AppProxyPortsQuery = { __typename?: 'Query', appProxyPorts: Array<{ __typename?: 'ProxyPort', scheme: string, host: string, container: string }> };

export type AppsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type AppsQuery = { __typename?: 'Query', apps: { __typename?: 'AppPaginationInfo', totalPages: number, items: Array<{ __typename?: 'App', id: string, name: string, type: AppTypes, status: AppStatus, tags: Array<{ __typename?: 'Tag', name: string }>, appMetaGithub?: { __typename?: 'AppGithubMeta', repoOwner: string, repoName: string } | null, ports: Array<{ __typename?: 'ProxyPort', scheme: string, host: string, container: string }> }> } };

export type BranchesQueryVariables = Exact<{
  installationId: Scalars['String']['input'];
  repositoryName: Scalars['String']['input'];
}>;


export type BranchesQuery = { __typename?: 'Query', branches: Array<{ __typename?: 'Branch', name: string }> };

export type CheckDomainStatusQueryVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type CheckDomainStatusQuery = { __typename?: 'Query', checkDomainStatus: number };

export type DashboardQueryVariables = Exact<{
  appLimit?: InputMaybe<Scalars['Int']['input']>;
  databaseLimit?: InputMaybe<Scalars['Int']['input']>;
  appPage?: InputMaybe<Scalars['Int']['input']>;
  databasePage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DashboardQuery = { __typename?: 'Query', apps: { __typename?: 'AppPaginationInfo', totalPages: number, items: Array<{ __typename?: 'App', id: string, name: string, createdAt: any, appMetaGithub?: { __typename?: 'AppGithubMeta', repoName: string, repoOwner: string } | null }> }, databases: { __typename?: 'DatabasePaginationInfo', totalPages: number, items: Array<{ __typename?: 'Database', id: string, name: string, type: DbTypes, createdAt: any }> } };

export type DatabaseByIdQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
}>;


export type DatabaseByIdQuery = { __typename?: 'Query', database: { __typename?: 'Database', id: string, name: string, type: DbTypes, version?: string | null, tags: Array<{ __typename?: 'Tag', name: string }>, apps: Array<{ __typename?: 'App', id: string, name: string }> } };

export type DatabaseInfoQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
}>;


export type DatabaseInfoQuery = { __typename?: 'Query', databaseInfo: { __typename?: 'DatabaseInfo', info: Array<string> } };

export type DatabaseLogsQueryVariables = Exact<{
  databaseId: Scalars['String']['input'];
}>;


export type DatabaseLogsQuery = { __typename?: 'Query', databaseLogs: { __typename?: 'Logs', logs: Array<string> } };

export type DatabaseQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type DatabaseQuery = { __typename?: 'Query', databases: { __typename?: 'DatabasePaginationInfo', totalPages: number, items: Array<{ __typename?: 'Database', id: string, name: string, type: DbTypes, version?: string | null, tags: Array<{ __typename?: 'Tag', name: string }> }> } };

export type DomainsQueryVariables = Exact<{
  appId: Scalars['String']['input'];
}>;


export type DomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'AppDomain', domain: string }> };

export type EnvVarsQueryVariables = Exact<{
  appId: Scalars['String']['input'];
}>;


export type EnvVarsQuery = { __typename?: 'Query', envVars: { __typename?: 'EnvVarList', envVars: Array<{ __typename?: 'EnvVar', key: string, value: string, asBuildArg: boolean }> } };

export type GetBuildingAppsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingAppsQuery = { __typename?: 'Query', buildingApps: Array<{ __typename?: 'App', id: string, name: string, status: AppStatus }> };

export type GetCreateLogsQueryVariables = Exact<{
  appId: Scalars['ID']['input'];
}>;


export type GetCreateLogsQuery = { __typename?: 'Query', createLogs: Array<{ __typename?: 'LogPayload', message: string, type: string }> };

export type GithubInstallationIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GithubInstallationIdQuery = { __typename?: 'Query', githubInstallationId: { __typename?: 'Installation', id: string } };

export type IsPluginInstalledQueryVariables = Exact<{
  pluginName: Scalars['String']['input'];
}>;


export type IsPluginInstalledQuery = { __typename?: 'Query', isPluginInstalled: { __typename?: 'IsPluginInstalled', isPluginInstalled: boolean } };

export type LedokkuLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type LedokkuLogsQuery = { __typename?: 'Query', ledokkuLogs: Array<{ __typename?: 'LogPayload', message: string, type: string }> };

export type PluginsQueryVariables = Exact<{ [key: string]: never; }>;


export type PluginsQuery = { __typename?: 'Query', plugins: Array<{ __typename?: 'Plugin', name: string, version: string }> };

export type RepositoriesQueryVariables = Exact<{
  installationId: Scalars['String']['input'];
}>;


export type RepositoriesQuery = { __typename?: 'Query', repositories: Array<{ __typename?: 'Repository', id: string, name: string, fullName: string, private: string }> };

export type SetupQueryVariables = Exact<{ [key: string]: never; }>;


export type SetupQuery = { __typename?: 'Query', setup: { __typename?: 'SetupResult', canConnectSsh: boolean, sshPublicKey: string, isGithubAppSetup: boolean, githubAppManifest: string } };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', allTags: Array<{ __typename?: 'Tag', name: string }> };

export type AppCreateLogsSubscriptionVariables = Exact<{
  appId: Scalars['ID']['input'];
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
export type AddAllowedUserMutationFn = Apollo.MutationFunction<AddAllowedUserMutation, AddAllowedUserMutationVariables>;

/**
 * __useAddAllowedUserMutation__
 *
 * To run a mutation, you first call `useAddAllowedUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAllowedUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAllowedUserMutation, { data, loading, error }] = useAddAllowedUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddAllowedUserMutation(baseOptions?: Apollo.MutationHookOptions<AddAllowedUserMutation, AddAllowedUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAllowedUserMutation, AddAllowedUserMutationVariables>(AddAllowedUserDocument, options);
      }
export type AddAllowedUserMutationHookResult = ReturnType<typeof useAddAllowedUserMutation>;
export type AddAllowedUserMutationResult = Apollo.MutationResult<AddAllowedUserMutation>;
export type AddAllowedUserMutationOptions = Apollo.BaseMutationOptions<AddAllowedUserMutation, AddAllowedUserMutationVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAppProxyPortMutation, AddAppProxyPortMutationVariables>(AddAppProxyPortDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddDomainMutation, AddDomainMutationVariables>(AddDomainDocument, options);
      }
export type AddDomainMutationHookResult = ReturnType<typeof useAddDomainMutation>;
export type AddDomainMutationResult = Apollo.MutationResult<AddDomainMutation>;
export type AddDomainMutationOptions = Apollo.BaseMutationOptions<AddDomainMutation, AddDomainMutationVariables>;
export const ChangeAppBranchDocument = gql`
    mutation ChangeAppBranch($input: UpdateBranchInput!) {
  changeBranch(input: $input)
}
    `;
export type ChangeAppBranchMutationFn = Apollo.MutationFunction<ChangeAppBranchMutation, ChangeAppBranchMutationVariables>;

/**
 * __useChangeAppBranchMutation__
 *
 * To run a mutation, you first call `useChangeAppBranchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeAppBranchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeAppBranchMutation, { data, loading, error }] = useChangeAppBranchMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeAppBranchMutation(baseOptions?: Apollo.MutationHookOptions<ChangeAppBranchMutation, ChangeAppBranchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeAppBranchMutation, ChangeAppBranchMutationVariables>(ChangeAppBranchDocument, options);
      }
export type ChangeAppBranchMutationHookResult = ReturnType<typeof useChangeAppBranchMutation>;
export type ChangeAppBranchMutationResult = Apollo.MutationResult<ChangeAppBranchMutation>;
export type ChangeAppBranchMutationOptions = Apollo.BaseMutationOptions<ChangeAppBranchMutation, ChangeAppBranchMutationVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAppDokkuMutation, CreateAppDokkuMutationVariables>(CreateAppDokkuDocument, options);
      }
export type CreateAppDokkuMutationHookResult = ReturnType<typeof useCreateAppDokkuMutation>;
export type CreateAppDokkuMutationResult = Apollo.MutationResult<CreateAppDokkuMutation>;
export type CreateAppDokkuMutationOptions = Apollo.BaseMutationOptions<CreateAppDokkuMutation, CreateAppDokkuMutationVariables>;
export const CreateAppGithubDocument = gql`
    mutation createAppGithub($input: CreateAppGithubInput!) {
  createAppGithub(input: $input) {
    id
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAppGithubMutation, CreateAppGithubMutationVariables>(CreateAppGithubDocument, options);
      }
export type CreateAppGithubMutationHookResult = ReturnType<typeof useCreateAppGithubMutation>;
export type CreateAppGithubMutationResult = Apollo.MutationResult<CreateAppGithubMutation>;
export type CreateAppGithubMutationOptions = Apollo.BaseMutationOptions<CreateAppGithubMutation, CreateAppGithubMutationVariables>;
export const CreateDatabaseDocument = gql`
    mutation createDatabase($input: CreateDatabaseInput!) {
  createDatabase(input: $input) {
    id
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatabaseMutation, CreateDatabaseMutationVariables>(CreateDatabaseDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DestroyAppMutation, DestroyAppMutationVariables>(DestroyAppDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>(DestroyDatabaseDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkDatabaseMutation, LinkDatabaseMutationVariables>(LinkDatabaseDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginWithGithubMutation, LoginWithGithubMutationVariables>(LoginWithGithubDocument, options);
      }
export type LoginWithGithubMutationHookResult = ReturnType<typeof useLoginWithGithubMutation>;
export type LoginWithGithubMutationResult = Apollo.MutationResult<LoginWithGithubMutation>;
export type LoginWithGithubMutationOptions = Apollo.BaseMutationOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>;
export const LoginWithGithubAccessTokenDocument = gql`
    mutation loginWithGithubAccessToken($input: GithubAuthInput!) {
  loginWithGithubAccessToken(input: $input) {
    token
  }
}
    `;
export type LoginWithGithubAccessTokenMutationFn = Apollo.MutationFunction<LoginWithGithubAccessTokenMutation, LoginWithGithubAccessTokenMutationVariables>;

/**
 * __useLoginWithGithubAccessTokenMutation__
 *
 * To run a mutation, you first call `useLoginWithGithubAccessTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithGithubAccessTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithGithubAccessTokenMutation, { data, loading, error }] = useLoginWithGithubAccessTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginWithGithubAccessTokenMutation(baseOptions?: Apollo.MutationHookOptions<LoginWithGithubAccessTokenMutation, LoginWithGithubAccessTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginWithGithubAccessTokenMutation, LoginWithGithubAccessTokenMutationVariables>(LoginWithGithubAccessTokenDocument, options);
      }
export type LoginWithGithubAccessTokenMutationHookResult = ReturnType<typeof useLoginWithGithubAccessTokenMutation>;
export type LoginWithGithubAccessTokenMutationResult = Apollo.MutationResult<LoginWithGithubAccessTokenMutation>;
export type LoginWithGithubAccessTokenMutationOptions = Apollo.BaseMutationOptions<LoginWithGithubAccessTokenMutation, LoginWithGithubAccessTokenMutationVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RebuildAppMutation, RebuildAppMutationVariables>(RebuildAppDocument, options);
      }
export type RebuildAppMutationHookResult = ReturnType<typeof useRebuildAppMutation>;
export type RebuildAppMutationResult = Apollo.MutationResult<RebuildAppMutation>;
export type RebuildAppMutationOptions = Apollo.BaseMutationOptions<RebuildAppMutation, RebuildAppMutationVariables>;
export const RemoveAllowedUserDocument = gql`
    mutation removeAllowedUser($email: String!) {
  removeAllowedEmail(email: $email)
}
    `;
export type RemoveAllowedUserMutationFn = Apollo.MutationFunction<RemoveAllowedUserMutation, RemoveAllowedUserMutationVariables>;

/**
 * __useRemoveAllowedUserMutation__
 *
 * To run a mutation, you first call `useRemoveAllowedUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAllowedUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAllowedUserMutation, { data, loading, error }] = useRemoveAllowedUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRemoveAllowedUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAllowedUserMutation, RemoveAllowedUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAllowedUserMutation, RemoveAllowedUserMutationVariables>(RemoveAllowedUserDocument, options);
      }
export type RemoveAllowedUserMutationHookResult = ReturnType<typeof useRemoveAllowedUserMutation>;
export type RemoveAllowedUserMutationResult = Apollo.MutationResult<RemoveAllowedUserMutation>;
export type RemoveAllowedUserMutationOptions = Apollo.BaseMutationOptions<RemoveAllowedUserMutation, RemoveAllowedUserMutationVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAppProxyPortMutation, RemoveAppProxyPortMutationVariables>(RemoveAppProxyPortDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveDomainMutation, RemoveDomainMutationVariables>(RemoveDomainDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RestartAppMutation, RestartAppMutationVariables>(RestartAppDocument, options);
      }
export type RestartAppMutationHookResult = ReturnType<typeof useRestartAppMutation>;
export type RestartAppMutationResult = Apollo.MutationResult<RestartAppMutation>;
export type RestartAppMutationOptions = Apollo.BaseMutationOptions<RestartAppMutation, RestartAppMutationVariables>;
export const SetAppTagsDocument = gql`
    mutation SetAppTags($input: TagUpdateInput!) {
  setAppTags(input: $input) {
    id
  }
}
    `;
export type SetAppTagsMutationFn = Apollo.MutationFunction<SetAppTagsMutation, SetAppTagsMutationVariables>;

/**
 * __useSetAppTagsMutation__
 *
 * To run a mutation, you first call `useSetAppTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAppTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAppTagsMutation, { data, loading, error }] = useSetAppTagsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetAppTagsMutation(baseOptions?: Apollo.MutationHookOptions<SetAppTagsMutation, SetAppTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetAppTagsMutation, SetAppTagsMutationVariables>(SetAppTagsDocument, options);
      }
export type SetAppTagsMutationHookResult = ReturnType<typeof useSetAppTagsMutation>;
export type SetAppTagsMutationResult = Apollo.MutationResult<SetAppTagsMutation>;
export type SetAppTagsMutationOptions = Apollo.BaseMutationOptions<SetAppTagsMutation, SetAppTagsMutationVariables>;
export const SetDatabaseTagsDocument = gql`
    mutation SetDatabaseTags($input: TagUpdateInput!) {
  setDatabaseTags(input: $input) {
    id
  }
}
    `;
export type SetDatabaseTagsMutationFn = Apollo.MutationFunction<SetDatabaseTagsMutation, SetDatabaseTagsMutationVariables>;

/**
 * __useSetDatabaseTagsMutation__
 *
 * To run a mutation, you first call `useSetDatabaseTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDatabaseTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDatabaseTagsMutation, { data, loading, error }] = useSetDatabaseTagsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetDatabaseTagsMutation(baseOptions?: Apollo.MutationHookOptions<SetDatabaseTagsMutation, SetDatabaseTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDatabaseTagsMutation, SetDatabaseTagsMutationVariables>(SetDatabaseTagsDocument, options);
      }
export type SetDatabaseTagsMutationHookResult = ReturnType<typeof useSetDatabaseTagsMutation>;
export type SetDatabaseTagsMutationResult = Apollo.MutationResult<SetDatabaseTagsMutation>;
export type SetDatabaseTagsMutationOptions = Apollo.BaseMutationOptions<SetDatabaseTagsMutation, SetDatabaseTagsMutationVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDomainMutation, SetDomainMutationVariables>(SetDomainDocument, options);
      }
export type SetDomainMutationHookResult = ReturnType<typeof useSetDomainMutation>;
export type SetDomainMutationResult = Apollo.MutationResult<SetDomainMutation>;
export type SetDomainMutationOptions = Apollo.BaseMutationOptions<SetDomainMutation, SetDomainMutationVariables>;
export const SetEnvVarDocument = gql`
    mutation setEnvVar($input: SetEnvVarInput!) {
  setEnvVar(input: $input) {
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
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetEnvVarMutation(baseOptions?: Apollo.MutationHookOptions<SetEnvVarMutation, SetEnvVarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetEnvVarMutation, SetEnvVarMutationVariables>(SetEnvVarDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlinkDatabaseMutation, UnlinkDatabaseMutationVariables>(UnlinkDatabaseDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>(UnsetEnvVarDocument, options);
      }
export type UnsetEnvVarMutationHookResult = ReturnType<typeof useUnsetEnvVarMutation>;
export type UnsetEnvVarMutationResult = Apollo.MutationResult<UnsetEnvVarMutation>;
export type UnsetEnvVarMutationOptions = Apollo.BaseMutationOptions<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>;
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

/**
 * __useActivityQuery__
 *
 * To run a query within a React component, call `useActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      refId: // value for 'refId'
 *   },
 * });
 */
export function useActivityQuery(baseOptions?: Apollo.QueryHookOptions<ActivityQuery, ActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActivityQuery, ActivityQueryVariables>(ActivityDocument, options);
      }
export function useActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActivityQuery, ActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActivityQuery, ActivityQueryVariables>(ActivityDocument, options);
        }
export type ActivityQueryHookResult = ReturnType<typeof useActivityQuery>;
export type ActivityLazyQueryHookResult = ReturnType<typeof useActivityLazyQuery>;
export type ActivityQueryResult = Apollo.QueryResult<ActivityQuery, ActivityQueryVariables>;
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

/**
 * __useAllowedUsersQuery__
 *
 * To run a query within a React component, call `useAllowedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllowedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllowedUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllowedUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllowedUsersQuery, AllowedUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllowedUsersQuery, AllowedUsersQueryVariables>(AllowedUsersDocument, options);
      }
export function useAllowedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllowedUsersQuery, AllowedUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllowedUsersQuery, AllowedUsersQueryVariables>(AllowedUsersDocument, options);
        }
export type AllowedUsersQueryHookResult = ReturnType<typeof useAllowedUsersQuery>;
export type AllowedUsersLazyQueryHookResult = ReturnType<typeof useAllowedUsersLazyQuery>;
export type AllowedUsersQueryResult = Apollo.QueryResult<AllowedUsersQuery, AllowedUsersQueryVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppByIdQuery, AppByIdQueryVariables>(AppByIdDocument, options);
      }
export function useAppByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppByIdQuery, AppByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppByIdQuery, AppByIdQueryVariables>(AppByIdDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppLogsQuery, AppLogsQueryVariables>(AppLogsDocument, options);
      }
export function useAppLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppLogsQuery, AppLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppLogsQuery, AppLogsQueryVariables>(AppLogsDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppProxyPortsQuery, AppProxyPortsQueryVariables>(AppProxyPortsDocument, options);
      }
export function useAppProxyPortsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppProxyPortsQuery, AppProxyPortsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppProxyPortsQuery, AppProxyPortsQueryVariables>(AppProxyPortsDocument, options);
        }
export type AppProxyPortsQueryHookResult = ReturnType<typeof useAppProxyPortsQuery>;
export type AppProxyPortsLazyQueryHookResult = ReturnType<typeof useAppProxyPortsLazyQuery>;
export type AppProxyPortsQueryResult = Apollo.QueryResult<AppProxyPortsQuery, AppProxyPortsQueryVariables>;
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
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useAppsQuery(baseOptions?: Apollo.QueryHookOptions<AppsQuery, AppsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppsQuery, AppsQueryVariables>(AppsDocument, options);
      }
export function useAppsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppsQuery, AppsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppsQuery, AppsQueryVariables>(AppsDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BranchesQuery, BranchesQueryVariables>(BranchesDocument, options);
      }
export function useBranchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BranchesQuery, BranchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BranchesQuery, BranchesQueryVariables>(BranchesDocument, options);
        }
export type BranchesQueryHookResult = ReturnType<typeof useBranchesQuery>;
export type BranchesLazyQueryHookResult = ReturnType<typeof useBranchesLazyQuery>;
export type BranchesQueryResult = Apollo.QueryResult<BranchesQuery, BranchesQueryVariables>;
export const CheckDomainStatusDocument = gql`
    query CheckDomainStatus($url: String!) {
  checkDomainStatus(url: $url)
}
    `;

/**
 * __useCheckDomainStatusQuery__
 *
 * To run a query within a React component, call `useCheckDomainStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckDomainStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckDomainStatusQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useCheckDomainStatusQuery(baseOptions: Apollo.QueryHookOptions<CheckDomainStatusQuery, CheckDomainStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckDomainStatusQuery, CheckDomainStatusQueryVariables>(CheckDomainStatusDocument, options);
      }
export function useCheckDomainStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckDomainStatusQuery, CheckDomainStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckDomainStatusQuery, CheckDomainStatusQueryVariables>(CheckDomainStatusDocument, options);
        }
export type CheckDomainStatusQueryHookResult = ReturnType<typeof useCheckDomainStatusQuery>;
export type CheckDomainStatusLazyQueryHookResult = ReturnType<typeof useCheckDomainStatusLazyQuery>;
export type CheckDomainStatusQueryResult = Apollo.QueryResult<CheckDomainStatusQuery, CheckDomainStatusQueryVariables>;
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
 *      appLimit: // value for 'appLimit'
 *      databaseLimit: // value for 'databaseLimit'
 *      appPage: // value for 'appPage'
 *      databasePage: // value for 'databasePage'
 *   },
 * });
 */
export function useDashboardQuery(baseOptions?: Apollo.QueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
      }
export function useDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatabaseByIdQuery, DatabaseByIdQueryVariables>(DatabaseByIdDocument, options);
      }
export function useDatabaseByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseByIdQuery, DatabaseByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatabaseByIdQuery, DatabaseByIdQueryVariables>(DatabaseByIdDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatabaseInfoQuery, DatabaseInfoQueryVariables>(DatabaseInfoDocument, options);
      }
export function useDatabaseInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseInfoQuery, DatabaseInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatabaseInfoQuery, DatabaseInfoQueryVariables>(DatabaseInfoDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatabaseLogsQuery, DatabaseLogsQueryVariables>(DatabaseLogsDocument, options);
      }
export function useDatabaseLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseLogsQuery, DatabaseLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatabaseLogsQuery, DatabaseLogsQueryVariables>(DatabaseLogsDocument, options);
        }
export type DatabaseLogsQueryHookResult = ReturnType<typeof useDatabaseLogsQuery>;
export type DatabaseLogsLazyQueryHookResult = ReturnType<typeof useDatabaseLogsLazyQuery>;
export type DatabaseLogsQueryResult = Apollo.QueryResult<DatabaseLogsQuery, DatabaseLogsQueryVariables>;
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
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useDatabaseQuery(baseOptions?: Apollo.QueryHookOptions<DatabaseQuery, DatabaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatabaseQuery, DatabaseQueryVariables>(DatabaseDocument, options);
      }
export function useDatabaseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatabaseQuery, DatabaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatabaseQuery, DatabaseQueryVariables>(DatabaseDocument, options);
        }
export type DatabaseQueryHookResult = ReturnType<typeof useDatabaseQuery>;
export type DatabaseLazyQueryHookResult = ReturnType<typeof useDatabaseLazyQuery>;
export type DatabaseQueryResult = Apollo.QueryResult<DatabaseQuery, DatabaseQueryVariables>;
export const DomainsDocument = gql`
    query domains($appId: String!) {
  domains(appId: $appId) {
    domain
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DomainsQuery, DomainsQueryVariables>(DomainsDocument, options);
      }
export function useDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainsQuery, DomainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DomainsQuery, DomainsQueryVariables>(DomainsDocument, options);
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
      asBuildArg
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, options);
      }
export function useEnvVarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, options);
        }
export type EnvVarsQueryHookResult = ReturnType<typeof useEnvVarsQuery>;
export type EnvVarsLazyQueryHookResult = ReturnType<typeof useEnvVarsLazyQuery>;
export type EnvVarsQueryResult = Apollo.QueryResult<EnvVarsQuery, EnvVarsQueryVariables>;
export const GetBuildingAppsDocument = gql`
    query GetBuildingApps {
  buildingApps {
    id
    name
    status
  }
}
    `;

/**
 * __useGetBuildingAppsQuery__
 *
 * To run a query within a React component, call `useGetBuildingAppsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingAppsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingAppsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBuildingAppsQuery(baseOptions?: Apollo.QueryHookOptions<GetBuildingAppsQuery, GetBuildingAppsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBuildingAppsQuery, GetBuildingAppsQueryVariables>(GetBuildingAppsDocument, options);
      }
export function useGetBuildingAppsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBuildingAppsQuery, GetBuildingAppsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBuildingAppsQuery, GetBuildingAppsQueryVariables>(GetBuildingAppsDocument, options);
        }
export type GetBuildingAppsQueryHookResult = ReturnType<typeof useGetBuildingAppsQuery>;
export type GetBuildingAppsLazyQueryHookResult = ReturnType<typeof useGetBuildingAppsLazyQuery>;
export type GetBuildingAppsQueryResult = Apollo.QueryResult<GetBuildingAppsQuery, GetBuildingAppsQueryVariables>;
export const GetCreateLogsDocument = gql`
    query GetCreateLogs($appId: ID!) {
  createLogs(appId: $appId) {
    message
    type
  }
}
    `;

/**
 * __useGetCreateLogsQuery__
 *
 * To run a query within a React component, call `useGetCreateLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreateLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreateLogsQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useGetCreateLogsQuery(baseOptions: Apollo.QueryHookOptions<GetCreateLogsQuery, GetCreateLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCreateLogsQuery, GetCreateLogsQueryVariables>(GetCreateLogsDocument, options);
      }
export function useGetCreateLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCreateLogsQuery, GetCreateLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCreateLogsQuery, GetCreateLogsQueryVariables>(GetCreateLogsDocument, options);
        }
export type GetCreateLogsQueryHookResult = ReturnType<typeof useGetCreateLogsQuery>;
export type GetCreateLogsLazyQueryHookResult = ReturnType<typeof useGetCreateLogsLazyQuery>;
export type GetCreateLogsQueryResult = Apollo.QueryResult<GetCreateLogsQuery, GetCreateLogsQueryVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>(GithubInstallationIdDocument, options);
      }
export function useGithubInstallationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GithubInstallationIdQuery, GithubInstallationIdQueryVariables>(GithubInstallationIdDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, options);
      }
export function useIsPluginInstalledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, options);
        }
export type IsPluginInstalledQueryHookResult = ReturnType<typeof useIsPluginInstalledQuery>;
export type IsPluginInstalledLazyQueryHookResult = ReturnType<typeof useIsPluginInstalledLazyQuery>;
export type IsPluginInstalledQueryResult = Apollo.QueryResult<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>;
export const LedokkuLogsDocument = gql`
    query LedokkuLogs {
  ledokkuLogs {
    message
    type
  }
}
    `;

/**
 * __useLedokkuLogsQuery__
 *
 * To run a query within a React component, call `useLedokkuLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLedokkuLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLedokkuLogsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLedokkuLogsQuery(baseOptions?: Apollo.QueryHookOptions<LedokkuLogsQuery, LedokkuLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LedokkuLogsQuery, LedokkuLogsQueryVariables>(LedokkuLogsDocument, options);
      }
export function useLedokkuLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LedokkuLogsQuery, LedokkuLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LedokkuLogsQuery, LedokkuLogsQueryVariables>(LedokkuLogsDocument, options);
        }
export type LedokkuLogsQueryHookResult = ReturnType<typeof useLedokkuLogsQuery>;
export type LedokkuLogsLazyQueryHookResult = ReturnType<typeof useLedokkuLogsLazyQuery>;
export type LedokkuLogsQueryResult = Apollo.QueryResult<LedokkuLogsQuery, LedokkuLogsQueryVariables>;
export const PluginsDocument = gql`
    query plugins {
  plugins {
    name
    version
  }
}
    `;

/**
 * __usePluginsQuery__
 *
 * To run a query within a React component, call `usePluginsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePluginsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePluginsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePluginsQuery(baseOptions?: Apollo.QueryHookOptions<PluginsQuery, PluginsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PluginsQuery, PluginsQueryVariables>(PluginsDocument, options);
      }
export function usePluginsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PluginsQuery, PluginsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PluginsQuery, PluginsQueryVariables>(PluginsDocument, options);
        }
export type PluginsQueryHookResult = ReturnType<typeof usePluginsQuery>;
export type PluginsLazyQueryHookResult = ReturnType<typeof usePluginsLazyQuery>;
export type PluginsQueryResult = Apollo.QueryResult<PluginsQuery, PluginsQueryVariables>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RepositoriesQuery, RepositoriesQueryVariables>(RepositoriesDocument, options);
      }
export function useRepositoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RepositoriesQuery, RepositoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RepositoriesQuery, RepositoriesQueryVariables>(RepositoriesDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SetupQuery, SetupQueryVariables>(SetupDocument, options);
      }
export function useSetupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SetupQuery, SetupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SetupQuery, SetupQueryVariables>(SetupDocument, options);
        }
export type SetupQueryHookResult = ReturnType<typeof useSetupQuery>;
export type SetupLazyQueryHookResult = ReturnType<typeof useSetupLazyQuery>;
export type SetupQueryResult = Apollo.QueryResult<SetupQuery, SetupQueryVariables>;
export const GetAllTagsDocument = gql`
    query GetAllTags {
  allTags {
    name
  }
}
    `;

/**
 * __useGetAllTagsQuery__
 *
 * To run a query within a React component, call `useGetAllTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTagsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTagsQuery, GetAllTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTagsQuery, GetAllTagsQueryVariables>(GetAllTagsDocument, options);
      }
export function useGetAllTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTagsQuery, GetAllTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTagsQuery, GetAllTagsQueryVariables>(GetAllTagsDocument, options);
        }
export type GetAllTagsQueryHookResult = ReturnType<typeof useGetAllTagsQuery>;
export type GetAllTagsLazyQueryHookResult = ReturnType<typeof useGetAllTagsLazyQuery>;
export type GetAllTagsQueryResult = Apollo.QueryResult<GetAllTagsQuery, GetAllTagsQueryVariables>;
export const AppCreateLogsDocument = gql`
    subscription appCreateLogs($appId: ID!) {
  appCreateLogs(appId: $appId) {
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
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useAppCreateLogsSubscription(baseOptions: Apollo.SubscriptionHookOptions<AppCreateLogsSubscription, AppCreateLogsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<AppCreateLogsSubscription, AppCreateLogsSubscriptionVariables>(AppCreateLogsDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CreateDatabaseLogsSubscription, CreateDatabaseLogsSubscriptionVariables>(CreateDatabaseLogsDocument, options);
      }
export type CreateDatabaseLogsSubscriptionHookResult = ReturnType<typeof useCreateDatabaseLogsSubscription>;
export type CreateDatabaseLogsSubscriptionResult = Apollo.SubscriptionResult<CreateDatabaseLogsSubscription>;
export const OnLedokkuLogsDocument = gql`
    subscription OnLedokkuLogs {
  onLedokkuLog {
    message
    type
  }
}
    `;

/**
 * __useOnLedokkuLogsSubscription__
 *
 * To run a query within a React component, call `useOnLedokkuLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnLedokkuLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnLedokkuLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnLedokkuLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnLedokkuLogsSubscription, OnLedokkuLogsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnLedokkuLogsSubscription, OnLedokkuLogsSubscriptionVariables>(OnLedokkuLogsDocument, options);
      }
export type OnLedokkuLogsSubscriptionHookResult = ReturnType<typeof useOnLedokkuLogsSubscription>;
export type OnLedokkuLogsSubscriptionResult = Apollo.SubscriptionResult<OnLedokkuLogsSubscription>;
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<LinkDatabaseLogsSubscription, LinkDatabaseLogsSubscriptionVariables>(LinkDatabaseLogsDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<AppRebuildLogsSubscription, AppRebuildLogsSubscriptionVariables>(AppRebuildLogsDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<AppRestartLogsSubscription, AppRestartLogsSubscriptionVariables>(AppRestartLogsDocument, options);
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UnlinkDatabaseLogsSubscription, UnlinkDatabaseLogsSubscriptionVariables>(UnlinkDatabaseLogsDocument, options);
      }
export type UnlinkDatabaseLogsSubscriptionHookResult = ReturnType<typeof useUnlinkDatabaseLogsSubscription>;
export type UnlinkDatabaseLogsSubscriptionResult = Apollo.SubscriptionResult<UnlinkDatabaseLogsSubscription>;