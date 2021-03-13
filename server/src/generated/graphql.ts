/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};



export type App = {
  __typename?: 'App';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  githubRepoId?: Maybe<Scalars['String']>;
  databases?: Maybe<Array<Database>>;
};

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
  domains: Array<Maybe<Scalars['String']>>;
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

export type CreateAppResult = {
  __typename?: 'CreateAppResult';
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

export type CreateAppInput = {
  name: Scalars['String'];
  gitRepoUrl?: Maybe<Scalars['String']>;
  branchName?: Maybe<Scalars['String']>;
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
  setup: SetupResult;
  apps: Array<App>;
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
  addDomain: AddDomainResult;
  removeDomain: RemoveDomainResult;
  setDomain: SetDomainResult;
  createApp: CreateAppResult;
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
};


export type MutationLoginWithGithubArgs = {
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


export type MutationCreateAppArgs = {
  input: CreateAppInput;
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

export type CacheControlScope =
  | 'PUBLIC'
  | 'PRIVATE';




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  App: ResolverTypeWrapper<App>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AppBuild: ResolverTypeWrapper<AppBuild>;
  AppBuildStatus: AppBuildStatus;
  Database: ResolverTypeWrapper<Database>;
  DatabaseTypes: DatabaseTypes;
  Domains: ResolverTypeWrapper<Domains>;
  RealTimeLog: ResolverTypeWrapper<RealTimeLog>;
  LoginResult: ResolverTypeWrapper<LoginResult>;
  CreateAppResult: ResolverTypeWrapper<CreateAppResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DestroyAppResult: ResolverTypeWrapper<DestroyAppResult>;
  RestartAppResult: ResolverTypeWrapper<RestartAppResult>;
  RebuildAppResult: ResolverTypeWrapper<RebuildAppResult>;
  DestroyDatabaseResult: ResolverTypeWrapper<DestroyDatabaseResult>;
  LinkDatabaseResult: ResolverTypeWrapper<LinkDatabaseResult>;
  UnlinkDatabaseResult: ResolverTypeWrapper<UnlinkDatabaseResult>;
  DokkuPlugin: ResolverTypeWrapper<DokkuPlugin>;
  DokkuPluginResult: ResolverTypeWrapper<DokkuPluginResult>;
  SetEnvVarResult: ResolverTypeWrapper<SetEnvVarResult>;
  UnsetEnvVarResult: ResolverTypeWrapper<UnsetEnvVarResult>;
  CreateDatabaseResult: ResolverTypeWrapper<CreateDatabaseResult>;
  AppLogsResult: ResolverTypeWrapper<AppLogsResult>;
  DatabaseInfoResult: ResolverTypeWrapper<DatabaseInfoResult>;
  DatabaseLogsResult: ResolverTypeWrapper<DatabaseLogsResult>;
  IsDatabaseLinkedResult: ResolverTypeWrapper<IsDatabaseLinkedResult>;
  EnvVar: ResolverTypeWrapper<EnvVar>;
  EnvVarsResult: ResolverTypeWrapper<EnvVarsResult>;
  SetDomainResult: ResolverTypeWrapper<SetDomainResult>;
  AddDomainResult: ResolverTypeWrapper<AddDomainResult>;
  RemoveDomainResult: ResolverTypeWrapper<RemoveDomainResult>;
  SetupResult: ResolverTypeWrapper<SetupResult>;
  IsPluginInstalledResult: ResolverTypeWrapper<IsPluginInstalledResult>;
  AppProxyPort: ResolverTypeWrapper<AppProxyPort>;
  CreateAppInput: CreateAppInput;
  RestartAppInput: RestartAppInput;
  RebuildAppInput: RebuildAppInput;
  CreateDatabaseInput: CreateDatabaseInput;
  UnlinkDatabaseInput: UnlinkDatabaseInput;
  SetEnvVarInput: SetEnvVarInput;
  UnsetEnvVarInput: UnsetEnvVarInput;
  DestroyAppInput: DestroyAppInput;
  AddDomainInput: AddDomainInput;
  RemoveDomainInput: RemoveDomainInput;
  SetDomainInput: SetDomainInput;
  LinkDatabaseInput: LinkDatabaseInput;
  DestroyDatabaseInput: DestroyDatabaseInput;
  AddAppProxyPortInput: AddAppProxyPortInput;
  RemoveAppProxyPortInput: RemoveAppProxyPortInput;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  CacheControlScope: CacheControlScope;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime'];
  App: App;
  ID: Scalars['ID'];
  String: Scalars['String'];
  AppBuild: AppBuild;
  Database: Database;
  Domains: Domains;
  RealTimeLog: RealTimeLog;
  LoginResult: LoginResult;
  CreateAppResult: CreateAppResult;
  Boolean: Scalars['Boolean'];
  DestroyAppResult: DestroyAppResult;
  RestartAppResult: RestartAppResult;
  RebuildAppResult: RebuildAppResult;
  DestroyDatabaseResult: DestroyDatabaseResult;
  LinkDatabaseResult: LinkDatabaseResult;
  UnlinkDatabaseResult: UnlinkDatabaseResult;
  DokkuPlugin: DokkuPlugin;
  DokkuPluginResult: DokkuPluginResult;
  SetEnvVarResult: SetEnvVarResult;
  UnsetEnvVarResult: UnsetEnvVarResult;
  CreateDatabaseResult: CreateDatabaseResult;
  AppLogsResult: AppLogsResult;
  DatabaseInfoResult: DatabaseInfoResult;
  DatabaseLogsResult: DatabaseLogsResult;
  IsDatabaseLinkedResult: IsDatabaseLinkedResult;
  EnvVar: EnvVar;
  EnvVarsResult: EnvVarsResult;
  SetDomainResult: SetDomainResult;
  AddDomainResult: AddDomainResult;
  RemoveDomainResult: RemoveDomainResult;
  SetupResult: SetupResult;
  IsPluginInstalledResult: IsPluginInstalledResult;
  AppProxyPort: AppProxyPort;
  CreateAppInput: CreateAppInput;
  RestartAppInput: RestartAppInput;
  RebuildAppInput: RebuildAppInput;
  CreateDatabaseInput: CreateDatabaseInput;
  UnlinkDatabaseInput: UnlinkDatabaseInput;
  SetEnvVarInput: SetEnvVarInput;
  UnsetEnvVarInput: UnsetEnvVarInput;
  DestroyAppInput: DestroyAppInput;
  AddDomainInput: AddDomainInput;
  RemoveDomainInput: RemoveDomainInput;
  SetDomainInput: SetDomainInput;
  LinkDatabaseInput: LinkDatabaseInput;
  DestroyDatabaseInput: DestroyDatabaseInput;
  AddAppProxyPortInput: AddAppProxyPortInput;
  RemoveAppProxyPortInput: RemoveAppProxyPortInput;
  Query: {};
  Subscription: {};
  Mutation: {};
  Upload: Scalars['Upload'];
  Int: Scalars['Int'];
};

export type CacheControlDirectiveArgs = {   maxAge?: Maybe<Scalars['Int']>;
  scope?: Maybe<CacheControlScope>; };

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type AppResolvers<ContextType = any, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  githubRepoId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  databases?: Resolver<Maybe<Array<ResolversTypes['Database']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppBuildResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppBuild'] = ResolversParentTypes['AppBuild']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['AppBuildStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatabaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Database'] = ResolversParentTypes['Database']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DatabaseTypes'], ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  apps?: Resolver<Maybe<Array<ResolversTypes['App']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DomainsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Domains'] = ResolversParentTypes['Domains']> = {
  domains?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RealTimeLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['RealTimeLog'] = ResolversParentTypes['RealTimeLog']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAppResult'] = ResolversParentTypes['CreateAppResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DestroyAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DestroyAppResult'] = ResolversParentTypes['DestroyAppResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestartAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RestartAppResult'] = ResolversParentTypes['RestartAppResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RebuildAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RebuildAppResult'] = ResolversParentTypes['RebuildAppResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DestroyDatabaseResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DestroyDatabaseResult'] = ResolversParentTypes['DestroyDatabaseResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LinkDatabaseResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LinkDatabaseResult'] = ResolversParentTypes['LinkDatabaseResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnlinkDatabaseResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnlinkDatabaseResult'] = ResolversParentTypes['UnlinkDatabaseResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DokkuPluginResolvers<ContextType = any, ParentType extends ResolversParentTypes['DokkuPlugin'] = ResolversParentTypes['DokkuPlugin']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DokkuPluginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DokkuPluginResult'] = ResolversParentTypes['DokkuPluginResult']> = {
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plugins?: Resolver<Array<ResolversTypes['DokkuPlugin']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetEnvVarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetEnvVarResult'] = ResolversParentTypes['SetEnvVarResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnsetEnvVarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnsetEnvVarResult'] = ResolversParentTypes['UnsetEnvVarResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateDatabaseResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateDatabaseResult'] = ResolversParentTypes['CreateDatabaseResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppLogsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppLogsResult'] = ResolversParentTypes['AppLogsResult']> = {
  logs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatabaseInfoResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatabaseInfoResult'] = ResolversParentTypes['DatabaseInfoResult']> = {
  info?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatabaseLogsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatabaseLogsResult'] = ResolversParentTypes['DatabaseLogsResult']> = {
  logs?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IsDatabaseLinkedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['IsDatabaseLinkedResult'] = ResolversParentTypes['IsDatabaseLinkedResult']> = {
  isLinked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnvVarResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnvVar'] = ResolversParentTypes['EnvVar']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnvVarsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnvVarsResult'] = ResolversParentTypes['EnvVarsResult']> = {
  envVars?: Resolver<Array<ResolversTypes['EnvVar']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetDomainResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetDomainResult'] = ResolversParentTypes['SetDomainResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddDomainResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddDomainResult'] = ResolversParentTypes['AddDomainResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveDomainResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveDomainResult'] = ResolversParentTypes['RemoveDomainResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetupResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetupResult'] = ResolversParentTypes['SetupResult']> = {
  canConnectSsh?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sshPublicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IsPluginInstalledResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['IsPluginInstalledResult'] = ResolversParentTypes['IsPluginInstalledResult']> = {
  isPluginInstalled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppProxyPortResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppProxyPort'] = ResolversParentTypes['AppProxyPort']> = {
  scheme?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  host?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  container?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  setup?: Resolver<ResolversTypes['SetupResult'], ParentType, ContextType>;
  apps?: Resolver<Array<ResolversTypes['App']>, ParentType, ContextType>;
  app?: Resolver<Maybe<ResolversTypes['App']>, ParentType, ContextType, RequireFields<QueryAppArgs, 'appId'>>;
  domains?: Resolver<ResolversTypes['Domains'], ParentType, ContextType, RequireFields<QueryDomainsArgs, 'appId'>>;
  database?: Resolver<Maybe<ResolversTypes['Database']>, ParentType, ContextType, RequireFields<QueryDatabaseArgs, 'databaseId'>>;
  databases?: Resolver<Array<ResolversTypes['Database']>, ParentType, ContextType>;
  isPluginInstalled?: Resolver<ResolversTypes['IsPluginInstalledResult'], ParentType, ContextType, RequireFields<QueryIsPluginInstalledArgs, 'pluginName'>>;
  dokkuPlugins?: Resolver<ResolversTypes['DokkuPluginResult'], ParentType, ContextType>;
  appLogs?: Resolver<ResolversTypes['AppLogsResult'], ParentType, ContextType, RequireFields<QueryAppLogsArgs, 'appId'>>;
  databaseInfo?: Resolver<ResolversTypes['DatabaseInfoResult'], ParentType, ContextType, RequireFields<QueryDatabaseInfoArgs, 'databaseId'>>;
  databaseLogs?: Resolver<ResolversTypes['DatabaseLogsResult'], ParentType, ContextType, RequireFields<QueryDatabaseLogsArgs, 'databaseId'>>;
  isDatabaseLinked?: Resolver<ResolversTypes['IsDatabaseLinkedResult'], ParentType, ContextType, RequireFields<QueryIsDatabaseLinkedArgs, 'databaseId' | 'appId'>>;
  envVars?: Resolver<ResolversTypes['EnvVarsResult'], ParentType, ContextType, RequireFields<QueryEnvVarsArgs, 'appId'>>;
  appProxyPorts?: Resolver<Array<ResolversTypes['AppProxyPort']>, ParentType, ContextType, RequireFields<QueryAppProxyPortsArgs, 'appId'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  unlinkDatabaseLogs?: SubscriptionResolver<ResolversTypes['RealTimeLog'], "unlinkDatabaseLogs", ParentType, ContextType>;
  linkDatabaseLogs?: SubscriptionResolver<ResolversTypes['RealTimeLog'], "linkDatabaseLogs", ParentType, ContextType>;
  createDatabaseLogs?: SubscriptionResolver<ResolversTypes['RealTimeLog'], "createDatabaseLogs", ParentType, ContextType>;
  appRestartLogs?: SubscriptionResolver<ResolversTypes['RealTimeLog'], "appRestartLogs", ParentType, ContextType>;
  appRebuildLogs?: SubscriptionResolver<ResolversTypes['RealTimeLog'], "appRebuildLogs", ParentType, ContextType>;
  appCreateLogs?: SubscriptionResolver<ResolversTypes['RealTimeLog'], "appCreateLogs", ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  loginWithGithub?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginWithGithubArgs, 'code'>>;
  addDomain?: Resolver<ResolversTypes['AddDomainResult'], ParentType, ContextType, RequireFields<MutationAddDomainArgs, 'input'>>;
  removeDomain?: Resolver<ResolversTypes['RemoveDomainResult'], ParentType, ContextType, RequireFields<MutationRemoveDomainArgs, 'input'>>;
  setDomain?: Resolver<ResolversTypes['SetDomainResult'], ParentType, ContextType, RequireFields<MutationSetDomainArgs, 'input'>>;
  createApp?: Resolver<ResolversTypes['CreateAppResult'], ParentType, ContextType, RequireFields<MutationCreateAppArgs, 'input'>>;
  createDatabase?: Resolver<ResolversTypes['CreateDatabaseResult'], ParentType, ContextType, RequireFields<MutationCreateDatabaseArgs, 'input'>>;
  setEnvVar?: Resolver<ResolversTypes['SetEnvVarResult'], ParentType, ContextType, RequireFields<MutationSetEnvVarArgs, 'input'>>;
  unsetEnvVar?: Resolver<ResolversTypes['UnsetEnvVarResult'], ParentType, ContextType, RequireFields<MutationUnsetEnvVarArgs, 'input'>>;
  destroyApp?: Resolver<ResolversTypes['DestroyAppResult'], ParentType, ContextType, RequireFields<MutationDestroyAppArgs, 'input'>>;
  restartApp?: Resolver<ResolversTypes['RestartAppResult'], ParentType, ContextType, RequireFields<MutationRestartAppArgs, 'input'>>;
  rebuildApp?: Resolver<ResolversTypes['RebuildAppResult'], ParentType, ContextType, RequireFields<MutationRebuildAppArgs, 'input'>>;
  destroyDatabase?: Resolver<ResolversTypes['DestroyDatabaseResult'], ParentType, ContextType, RequireFields<MutationDestroyDatabaseArgs, 'input'>>;
  linkDatabase?: Resolver<ResolversTypes['LinkDatabaseResult'], ParentType, ContextType, RequireFields<MutationLinkDatabaseArgs, 'input'>>;
  unlinkDatabase?: Resolver<ResolversTypes['UnlinkDatabaseResult'], ParentType, ContextType, RequireFields<MutationUnlinkDatabaseArgs, 'input'>>;
  addAppProxyPort?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAddAppProxyPortArgs, 'input'>>;
  removeAppProxyPort?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveAppProxyPortArgs, 'input'>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  App?: AppResolvers<ContextType>;
  AppBuild?: AppBuildResolvers<ContextType>;
  Database?: DatabaseResolvers<ContextType>;
  Domains?: DomainsResolvers<ContextType>;
  RealTimeLog?: RealTimeLogResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  CreateAppResult?: CreateAppResultResolvers<ContextType>;
  DestroyAppResult?: DestroyAppResultResolvers<ContextType>;
  RestartAppResult?: RestartAppResultResolvers<ContextType>;
  RebuildAppResult?: RebuildAppResultResolvers<ContextType>;
  DestroyDatabaseResult?: DestroyDatabaseResultResolvers<ContextType>;
  LinkDatabaseResult?: LinkDatabaseResultResolvers<ContextType>;
  UnlinkDatabaseResult?: UnlinkDatabaseResultResolvers<ContextType>;
  DokkuPlugin?: DokkuPluginResolvers<ContextType>;
  DokkuPluginResult?: DokkuPluginResultResolvers<ContextType>;
  SetEnvVarResult?: SetEnvVarResultResolvers<ContextType>;
  UnsetEnvVarResult?: UnsetEnvVarResultResolvers<ContextType>;
  CreateDatabaseResult?: CreateDatabaseResultResolvers<ContextType>;
  AppLogsResult?: AppLogsResultResolvers<ContextType>;
  DatabaseInfoResult?: DatabaseInfoResultResolvers<ContextType>;
  DatabaseLogsResult?: DatabaseLogsResultResolvers<ContextType>;
  IsDatabaseLinkedResult?: IsDatabaseLinkedResultResolvers<ContextType>;
  EnvVar?: EnvVarResolvers<ContextType>;
  EnvVarsResult?: EnvVarsResultResolvers<ContextType>;
  SetDomainResult?: SetDomainResultResolvers<ContextType>;
  AddDomainResult?: AddDomainResultResolvers<ContextType>;
  RemoveDomainResult?: RemoveDomainResultResolvers<ContextType>;
  SetupResult?: SetupResultResolvers<ContextType>;
  IsPluginInstalledResult?: IsPluginInstalledResultResolvers<ContextType>;
  AppProxyPort?: AppProxyPortResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;