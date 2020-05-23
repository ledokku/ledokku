/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type App = {
   __typename?: 'App';
  id: Scalars['ID'];
  name: Scalars['String'];
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

export type DeleteAppResult = {
   __typename?: 'DeleteAppResult';
  result: Scalars['String'];
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

export type AddEnvVarResult = {
   __typename?: 'AddEnvVarResult';
  result: Scalars['String'];
};

export type DeleteEnvVarResult = {
   __typename?: 'DeleteEnvVarResult';
  result: Scalars['String'];
};

export type AppLogsResult = {
   __typename?: 'AppLogsResult';
  logs: Scalars['String'];
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

export type CreateAppInput = {
  name: Scalars['String'];
  gitUrl: Scalars['String'];
};

export type CreateDatabaseInput = {
  name: Scalars['String'];
  type: DatabaseTypes;
};

export type AddEnvVarInput = {
  name: Scalars['String'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type DeleteEnvVarInput = {
  name: Scalars['String'];
  key: Scalars['String'];
}
export type DeleteAppInput = {
  name: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  apps: Array<App>;
  app?: Maybe<App>;
  databases: Array<Database>;
  dokkuPlugins: DokkuPluginResult;
  appLogs: AppLogsResult;
  envVars: EnvVarsResult;
};


export type QueryAppArgs = {
  appId: Scalars['String'];
};


export type QueryAppLogsArgs = {
  name: Scalars['String'];
};


export type QueryEnvVarsArgs = {
  name: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  createApp: CreateAppResult;
  createDatabase: Database;
  addEnvVar: AddEnvVarResult;
  deleteEnvVar: DeleteEnvVarResult;
  deleteApp: DeleteAppResult;
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


export type MutationAddEnvVarArgs = {
  input: AddEnvVarInput;
};


export type MutationDeleteEnvVarArgs = {
  input: DeleteEnvVarInput;}

export type MutationDeleteAppArgs = {
  input: DeleteAppInput;
};

export type CacheControlScope = 
  | 'PUBLIC'
  | 'PRIVATE';




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

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

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  App: ResolverTypeWrapper<App>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  AppBuild: ResolverTypeWrapper<AppBuild>,
  AppBuildStatus: AppBuildStatus,
  Database: ResolverTypeWrapper<Database>,
  DatabaseTypes: DatabaseTypes,
  LoginResult: ResolverTypeWrapper<LoginResult>,
  CreateAppResult: ResolverTypeWrapper<CreateAppResult>,
  DeleteAppResult: ResolverTypeWrapper<DeleteAppResult>,
  DokkuPlugin: ResolverTypeWrapper<DokkuPlugin>,
  DokkuPluginResult: ResolverTypeWrapper<DokkuPluginResult>,
  AddEnvVarResult: ResolverTypeWrapper<AddEnvVarResult>,
  DeleteEnvVarResult: ResolverTypeWrapper<DeleteEnvVarResult>,
  AppLogsResult: ResolverTypeWrapper<AppLogsResult>,
  EnvVar: ResolverTypeWrapper<EnvVar>,
  EnvVarsResult: ResolverTypeWrapper<EnvVarsResult>,
  CreateAppInput: CreateAppInput,
  CreateDatabaseInput: CreateDatabaseInput,
  AddEnvVarInput: AddEnvVarInput,
  DeleteEnvVarInput: DeleteEnvVarInput,
  DeleteAppInput: DeleteAppInput,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
  CacheControlScope: CacheControlScope,
  Upload: ResolverTypeWrapper<Scalars['Upload']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  App: App,
  ID: Scalars['ID'],
  AppBuild: AppBuild,
  AppBuildStatus: AppBuildStatus,
  Database: Database,
  DatabaseTypes: DatabaseTypes,
  LoginResult: LoginResult,
  CreateAppResult: CreateAppResult,
  DeleteAppResult: DeleteAppResult,
  DokkuPlugin: DokkuPlugin,
  DokkuPluginResult: DokkuPluginResult,
  AddEnvVarResult: AddEnvVarResult,
  DeleteEnvVarResult: DeleteEnvVarResult,
  AppLogsResult: AppLogsResult,
  EnvVar: EnvVar,
  EnvVarsResult: EnvVarsResult,
  CreateAppInput: CreateAppInput,
  CreateDatabaseInput: CreateDatabaseInput,
  AddEnvVarInput: AddEnvVarInput,
  DeleteEnvVarInput: DeleteEnvVarInput,
  DeleteAppInput: DeleteAppInput,
  Query: {},
  Mutation: {},
  CacheControlScope: CacheControlScope,
  Upload: Scalars['Upload'],
};

export type AppResolvers<ContextType = any, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AppBuildResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppBuild'] = ResolversParentTypes['AppBuild']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['AppBuildStatus'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DatabaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Database'] = ResolversParentTypes['Database']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['DatabaseTypes'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CreateAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAppResult'] = ResolversParentTypes['CreateAppResult']> = {
  app?: Resolver<ResolversTypes['App'], ParentType, ContextType>,
  appBuild?: Resolver<ResolversTypes['AppBuild'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DeleteAppResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteAppResult'] = ResolversParentTypes['DeleteAppResult']> = {
  result?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DokkuPluginResolvers<ContextType = any, ParentType extends ResolversParentTypes['DokkuPlugin'] = ResolversParentTypes['DokkuPlugin']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DokkuPluginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DokkuPluginResult'] = ResolversParentTypes['DokkuPluginResult']> = {
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  plugins?: Resolver<Array<ResolversTypes['DokkuPlugin']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AddEnvVarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddEnvVarResult'] = ResolversParentTypes['AddEnvVarResult']> = {
  result?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DeleteEnvVarResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteEnvVarResult'] = ResolversParentTypes['DeleteEnvVarResult']> = {
  result?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AppLogsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppLogsResult'] = ResolversParentTypes['AppLogsResult']> = {
  logs?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type EnvVarResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnvVar'] = ResolversParentTypes['EnvVar']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type EnvVarsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnvVarsResult'] = ResolversParentTypes['EnvVarsResult']> = {
  envVars?: Resolver<Array<ResolversTypes['EnvVar']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  apps?: Resolver<Array<ResolversTypes['App']>, ParentType, ContextType>,
  app?: Resolver<Maybe<ResolversTypes['App']>, ParentType, ContextType, RequireFields<QueryAppArgs, 'appId'>>,
  databases?: Resolver<Array<ResolversTypes['Database']>, ParentType, ContextType>,
  dokkuPlugins?: Resolver<ResolversTypes['DokkuPluginResult'], ParentType, ContextType>,
  appLogs?: Resolver<ResolversTypes['AppLogsResult'], ParentType, ContextType, RequireFields<QueryAppLogsArgs, 'name'>>,
  envVars?: Resolver<ResolversTypes['EnvVarsResult'], ParentType, ContextType, RequireFields<QueryEnvVarsArgs, 'name'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  loginWithGithub?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginWithGithubArgs, 'code'>>,
  createApp?: Resolver<ResolversTypes['CreateAppResult'], ParentType, ContextType, RequireFields<MutationCreateAppArgs, 'input'>>,
  createDatabase?: Resolver<ResolversTypes['Database'], ParentType, ContextType, RequireFields<MutationCreateDatabaseArgs, 'input'>>,
  addEnvVar?: Resolver<ResolversTypes['AddEnvVarResult'], ParentType, ContextType, RequireFields<MutationAddEnvVarArgs, 'input'>>,
  deleteEnvVar?: Resolver<ResolversTypes['DeleteEnvVarResult'], ParentType, ContextType, RequireFields<MutationDeleteEnvVarArgs, 'input'>>,
  deleteApp?: Resolver<ResolversTypes['DeleteAppResult'], ParentType, ContextType, RequireFields<MutationDeleteAppArgs, 'input'>>,
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type Resolvers<ContextType = any> = {
  App?: AppResolvers<ContextType>,
  AppBuild?: AppBuildResolvers<ContextType>,
  Database?: DatabaseResolvers<ContextType>,
  LoginResult?: LoginResultResolvers<ContextType>,
  CreateAppResult?: CreateAppResultResolvers<ContextType>,
  DeleteAppResult?: DeleteAppResultResolvers<ContextType>,
  DokkuPlugin?: DokkuPluginResolvers<ContextType>,
  DokkuPluginResult?: DokkuPluginResultResolvers<ContextType>,
  AddEnvVarResult?: AddEnvVarResultResolvers<ContextType>,
  DeleteEnvVarResult?: DeleteEnvVarResultResolvers<ContextType>,
  AppLogsResult?: AppLogsResultResolvers<ContextType>,
  EnvVar?: EnvVarResolvers<ContextType>,
  EnvVarsResult?: EnvVarsResultResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Upload?: GraphQLScalarType,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
