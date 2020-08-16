/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
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
  githubRepoUrl: Scalars['String'];
  createdAt: Scalars['DateTime'];
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
  createdAt: Scalars['DateTime'];
};

export type DatabaseTypes = 
  | 'REDIS'
  | 'POSTGRESQL'
  | 'MONGODB'
  | 'MYSQL';

export type LoginResult = {
  __typename?: 'LoginResult';
  token: Scalars['String'];
};

export type CreateAppResult = {
  __typename?: 'CreateAppResult';
  app: App;
  appBuild: AppBuild;
};

export type DestroyAppResult = {
  __typename?: 'DestroyAppResult';
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

export type AppLogsResult = {
  __typename?: 'AppLogsResult';
  logs: Array<Maybe<Scalars['String']>>;
};

export type DatabaseInfoResult = {
  __typename?: 'DatabaseInfoResult';
  info: Array<Maybe<Scalars['String']>>;
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

export type SetupResult = {
  __typename?: 'SetupResult';
  canConnectSsh: Scalars['Boolean'];
  sshPublicKey: Scalars['String'];
};

export type IsPluginInstalledResult = {
  __typename?: 'IsPluginInstalledResult';
  isPluginInstalled: Scalars['Boolean'];
};

export type CreateAppInput = {
  name: Scalars['String'];
  gitUrl: Scalars['String'];
};

export type CreateDatabaseInput = {
  name: Scalars['String'];
  type: DatabaseTypes;
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

export type LinkDatabaseInput = {
  appId: Scalars['String'];
  databaseId: Scalars['String'];
};

export type DestroyDatabaseInput = {
  databaseId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  setup: SetupResult;
  apps: Array<App>;
  app?: Maybe<App>;
  database?: Maybe<Database>;
  databases: Array<Database>;
  isPluginInstalled: IsPluginInstalledResult;
  dokkuPlugins: DokkuPluginResult;
  appLogs: AppLogsResult;
  databaseInfo: DatabaseInfoResult;
  databaseLogs: DatabaseLogsResult;
  isDatabaseLinked: IsDatabaseLinkedResult;
  envVars: EnvVarsResult;
};


export type QueryAppArgs = {
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

export type Mutation = {
  __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  createApp: CreateAppResult;
  createDatabase: Database;
  setEnvVar: SetEnvVarResult;
  unsetEnvVar: UnsetEnvVarResult;
  destroyApp: DestroyAppResult;
  destroyDatabase: DestroyDatabaseResult;
  linkDatabase: LinkDatabaseResult;
};


export type MutationLoginWithGithubArgs = {
  code: Scalars['String'];
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


export type MutationDestroyDatabaseArgs = {
  input: DestroyDatabaseInput;
};


export type MutationLinkDatabaseArgs = {
  input: LinkDatabaseInput;
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

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  LoginResult: ResolverTypeWrapper<LoginResult>;
  CreateAppResult: ResolverTypeWrapper<CreateAppResult>;
  DestroyAppResult: ResolverTypeWrapper<DestroyAppResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DestroyDatabaseResult: ResolverTypeWrapper<DestroyDatabaseResult>;
  LinkDatabaseResult: ResolverTypeWrapper<LinkDatabaseResult>;
  DokkuPlugin: ResolverTypeWrapper<DokkuPlugin>;
  DokkuPluginResult: ResolverTypeWrapper<DokkuPluginResult>;
  SetEnvVarResult: ResolverTypeWrapper<SetEnvVarResult>;
  UnsetEnvVarResult: ResolverTypeWrapper<UnsetEnvVarResult>;
  AppLogsResult: ResolverTypeWrapper<AppLogsResult>;
  DatabaseInfoResult: ResolverTypeWrapper<DatabaseInfoResult>;
  DatabaseLogsResult: ResolverTypeWrapper<DatabaseLogsResult>;
  IsDatabaseLinkedResult: ResolverTypeWrapper<IsDatabaseLinkedResult>;
  EnvVar: ResolverTypeWrapper<EnvVar>;
  EnvVarsResult: ResolverTypeWrapper<EnvVarsResult>;
  SetupResult: ResolverTypeWrapper<SetupResult>;
  IsPluginInstalledResult: ResolverTypeWrapper<IsPluginInstalledResult>;
  CreateAppInput: CreateAppInput;
  CreateDatabaseInput: CreateDatabaseInput;
  SetEnvVarInput: SetEnvVarInput;
  UnsetEnvVarInput: UnsetEnvVarInput;
  DestroyAppInput: DestroyAppInput;
  LinkDatabaseInput: LinkDatabaseInput;
  DestroyDatabaseInput: DestroyDatabaseInput;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  CacheControlScope: CacheControlScope;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime'];
  App: App;
  ID: Scalars['ID'];
  String: Scalars['String'];
  AppBuild: AppBuild;
  Database: Database;
  LoginResult: LoginResult;
  CreateAppResult: CreateAppResult;
  DestroyAppResult: DestroyAppResult;
  Boolean: Scalars['Boolean'];
  DestroyDatabaseResult: DestroyDatabaseResult;
  LinkDatabaseResult: LinkDatabaseResult;
  DokkuPlugin: DokkuPlugin;
  DokkuPluginResult: DokkuPluginResult;
  SetEnvVarResult: SetEnvVarResult;
  UnsetEnvVarResult: UnsetEnvVarResult;
  AppLogsResult: AppLogsResult;
  DatabaseInfoResult: DatabaseInfoResult;
  DatabaseLogsResult: DatabaseLogsResult;
  IsDatabaseLinkedResult: IsDatabaseLinkedResult;
  EnvVar: EnvVar;
  EnvVarsResult: EnvVarsResult;
  SetupResult: SetupResult;
  IsPluginInstalledResult: IsPluginInstalledResult;
  CreateAppInput: CreateAppInput;
  CreateDatabaseInput: CreateDatabaseInput;
  SetEnvVarInput: SetEnvVarInput;
  UnsetEnvVarInput: UnsetEnvVarInput;
  DestroyAppInput: DestroyAppInput;
  LinkDatabaseInput: LinkDatabaseInput;
  DestroyDatabaseInput: DestroyDatabaseInput;
  Query: {};
  Mutation: {};
  Upload: Scalars['Upload'];
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type AppResolvers<ContextType = any, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  githubRepoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type AppBuildResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppBuild'] = ResolversParentTypes['AppBuild']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['AppBuildStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DatabaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Database'] = ResolversParentTypes['Database']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DatabaseTypes'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CreateAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAppResult'] = ResolversParentTypes['CreateAppResult']> = {
  app?: Resolver<ResolversTypes['App'], ParentType, ContextType>;
  appBuild?: Resolver<ResolversTypes['AppBuild'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DestroyAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DestroyAppResult'] = ResolversParentTypes['DestroyAppResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DestroyDatabaseResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DestroyDatabaseResult'] = ResolversParentTypes['DestroyDatabaseResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type LinkDatabaseResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LinkDatabaseResult'] = ResolversParentTypes['LinkDatabaseResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DokkuPluginResolvers<ContextType = any, ParentType extends ResolversParentTypes['DokkuPlugin'] = ResolversParentTypes['DokkuPlugin']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DokkuPluginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DokkuPluginResult'] = ResolversParentTypes['DokkuPluginResult']> = {
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plugins?: Resolver<Array<ResolversTypes['DokkuPlugin']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SetEnvVarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetEnvVarResult'] = ResolversParentTypes['SetEnvVarResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UnsetEnvVarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnsetEnvVarResult'] = ResolversParentTypes['UnsetEnvVarResult']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type AppLogsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppLogsResult'] = ResolversParentTypes['AppLogsResult']> = {
  logs?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DatabaseInfoResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatabaseInfoResult'] = ResolversParentTypes['DatabaseInfoResult']> = {
  info?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DatabaseLogsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatabaseLogsResult'] = ResolversParentTypes['DatabaseLogsResult']> = {
  logs?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type IsDatabaseLinkedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['IsDatabaseLinkedResult'] = ResolversParentTypes['IsDatabaseLinkedResult']> = {
  isLinked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type EnvVarResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnvVar'] = ResolversParentTypes['EnvVar']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type EnvVarsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnvVarsResult'] = ResolversParentTypes['EnvVarsResult']> = {
  envVars?: Resolver<Array<ResolversTypes['EnvVar']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SetupResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetupResult'] = ResolversParentTypes['SetupResult']> = {
  canConnectSsh?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sshPublicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type IsPluginInstalledResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['IsPluginInstalledResult'] = ResolversParentTypes['IsPluginInstalledResult']> = {
  isPluginInstalled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  setup?: Resolver<ResolversTypes['SetupResult'], ParentType, ContextType>;
  apps?: Resolver<Array<ResolversTypes['App']>, ParentType, ContextType>;
  app?: Resolver<Maybe<ResolversTypes['App']>, ParentType, ContextType, RequireFields<QueryAppArgs, 'appId'>>;
  database?: Resolver<Maybe<ResolversTypes['Database']>, ParentType, ContextType, RequireFields<QueryDatabaseArgs, 'databaseId'>>;
  databases?: Resolver<Array<ResolversTypes['Database']>, ParentType, ContextType>;
  isPluginInstalled?: Resolver<ResolversTypes['IsPluginInstalledResult'], ParentType, ContextType, RequireFields<QueryIsPluginInstalledArgs, 'pluginName'>>;
  dokkuPlugins?: Resolver<ResolversTypes['DokkuPluginResult'], ParentType, ContextType>;
  appLogs?: Resolver<ResolversTypes['AppLogsResult'], ParentType, ContextType, RequireFields<QueryAppLogsArgs, 'appId'>>;
  databaseInfo?: Resolver<ResolversTypes['DatabaseInfoResult'], ParentType, ContextType, RequireFields<QueryDatabaseInfoArgs, 'databaseId'>>;
  databaseLogs?: Resolver<ResolversTypes['DatabaseLogsResult'], ParentType, ContextType, RequireFields<QueryDatabaseLogsArgs, 'databaseId'>>;
  isDatabaseLinked?: Resolver<ResolversTypes['IsDatabaseLinkedResult'], ParentType, ContextType, RequireFields<QueryIsDatabaseLinkedArgs, 'databaseId' | 'appId'>>;
  envVars?: Resolver<ResolversTypes['EnvVarsResult'], ParentType, ContextType, RequireFields<QueryEnvVarsArgs, 'appId'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  loginWithGithub?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginWithGithubArgs, 'code'>>;
  createApp?: Resolver<ResolversTypes['CreateAppResult'], ParentType, ContextType, RequireFields<MutationCreateAppArgs, 'input'>>;
  createDatabase?: Resolver<ResolversTypes['Database'], ParentType, ContextType, RequireFields<MutationCreateDatabaseArgs, 'input'>>;
  setEnvVar?: Resolver<ResolversTypes['SetEnvVarResult'], ParentType, ContextType, RequireFields<MutationSetEnvVarArgs, 'input'>>;
  unsetEnvVar?: Resolver<ResolversTypes['UnsetEnvVarResult'], ParentType, ContextType, RequireFields<MutationUnsetEnvVarArgs, 'input'>>;
  destroyApp?: Resolver<ResolversTypes['DestroyAppResult'], ParentType, ContextType, RequireFields<MutationDestroyAppArgs, 'input'>>;
  destroyDatabase?: Resolver<ResolversTypes['DestroyDatabaseResult'], ParentType, ContextType, RequireFields<MutationDestroyDatabaseArgs, 'input'>>;
  linkDatabase?: Resolver<ResolversTypes['LinkDatabaseResult'], ParentType, ContextType, RequireFields<MutationLinkDatabaseArgs, 'input'>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  App?: AppResolvers<ContextType>;
  AppBuild?: AppBuildResolvers<ContextType>;
  Database?: DatabaseResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  CreateAppResult?: CreateAppResultResolvers<ContextType>;
  DestroyAppResult?: DestroyAppResultResolvers<ContextType>;
  DestroyDatabaseResult?: DestroyDatabaseResultResolvers<ContextType>;
  LinkDatabaseResult?: LinkDatabaseResultResolvers<ContextType>;
  DokkuPlugin?: DokkuPluginResolvers<ContextType>;
  DokkuPluginResult?: DokkuPluginResultResolvers<ContextType>;
  SetEnvVarResult?: SetEnvVarResultResolvers<ContextType>;
  UnsetEnvVarResult?: UnsetEnvVarResultResolvers<ContextType>;
  AppLogsResult?: AppLogsResultResolvers<ContextType>;
  DatabaseInfoResult?: DatabaseInfoResultResolvers<ContextType>;
  DatabaseLogsResult?: DatabaseLogsResultResolvers<ContextType>;
  IsDatabaseLinkedResult?: IsDatabaseLinkedResultResolvers<ContextType>;
  EnvVar?: EnvVarResolvers<ContextType>;
  EnvVarsResult?: EnvVarsResultResolvers<ContextType>;
  SetupResult?: SetupResultResolvers<ContextType>;
  IsPluginInstalledResult?: IsPluginInstalledResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
