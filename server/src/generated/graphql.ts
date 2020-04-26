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

export type Server = {
   __typename?: 'Server';
  id: Scalars['ID'];
  name: Scalars['String'];
  ip?: Maybe<Scalars['String']>;
  type: ServerTypes;
  status: ServerStatus;
  apps?: Maybe<Array<App>>;
  databases?: Maybe<Array<Database>>;
};

export type ServerTypes = 
  'AWS' |
  'DIGITALOCEAN' |
  'LINODE';

export type ServerStatus = 
  'NEW' |
  'ACTIVE' |
  'OFF' |
  'ARCHIVE';

export type App = {
   __typename?: 'App';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Database = {
   __typename?: 'Database';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type LoginResult = {
   __typename?: 'LoginResult';
  token: Scalars['String'];
};

export type CreateAppInput = {
  serverId: Scalars['String'];
  name: Scalars['String'];
  gitUrl: Scalars['String'];
};

export type CreateDatabaseInput = {
  serverId: Scalars['String'];
  name: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  servers?: Maybe<Array<Server>>;
  server?: Maybe<Server>;
};


export type QueryServerArgs = {
  id: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  saveDigitalOceanAccessToken?: Maybe<Scalars['Boolean']>;
  createDigitalOceanServer: Server;
  createApp: App;
  createDatabase: Database;
  updateServerInfo?: Maybe<Scalars['Boolean']>;
};


export type MutationLoginWithGithubArgs = {
  code: Scalars['String'];
};


export type MutationSaveDigitalOceanAccessTokenArgs = {
  digitalOceanAccessToken: Scalars['String'];
};


export type MutationCreateDigitalOceanServerArgs = {
  serverName: Scalars['String'];
};


export type MutationCreateAppArgs = {
  input: CreateAppInput;
};


export type MutationCreateDatabaseArgs = {
  input: CreateDatabaseInput;
};


export type MutationUpdateServerInfoArgs = {
  serverId: Scalars['String'];
};

export type CacheControlScope = 
  'PUBLIC' |
  'PRIVATE';




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
  Server: ResolverTypeWrapper<Server>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  ServerTypes: ServerTypes,
  ServerStatus: ServerStatus,
  App: ResolverTypeWrapper<App>,
  Database: ResolverTypeWrapper<Database>,
  LoginResult: ResolverTypeWrapper<LoginResult>,
  CreateAppInput: CreateAppInput,
  CreateDatabaseInput: CreateDatabaseInput,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
  CacheControlScope: CacheControlScope,
  Upload: ResolverTypeWrapper<Scalars['Upload']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  Server: Server,
  ID: Scalars['ID'],
  ServerTypes: ServerTypes,
  ServerStatus: ServerStatus,
  App: App,
  Database: Database,
  LoginResult: LoginResult,
  CreateAppInput: CreateAppInput,
  CreateDatabaseInput: CreateDatabaseInput,
  Query: {},
  Mutation: {},
  CacheControlScope: CacheControlScope,
  Upload: Scalars['Upload'],
};

export type ServerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Server'] = ResolversParentTypes['Server']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['ServerTypes'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['ServerStatus'], ParentType, ContextType>,
  apps?: Resolver<Maybe<Array<ResolversTypes['App']>>, ParentType, ContextType>,
  databases?: Resolver<Maybe<Array<ResolversTypes['Database']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AppResolvers<ContextType = any, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type DatabaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Database'] = ResolversParentTypes['Database']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  servers?: Resolver<Maybe<Array<ResolversTypes['Server']>>, ParentType, ContextType>,
  server?: Resolver<Maybe<ResolversTypes['Server']>, ParentType, ContextType, RequireFields<QueryServerArgs, 'id'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  loginWithGithub?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationLoginWithGithubArgs, 'code'>>,
  saveDigitalOceanAccessToken?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSaveDigitalOceanAccessTokenArgs, 'digitalOceanAccessToken'>>,
  createDigitalOceanServer?: Resolver<ResolversTypes['Server'], ParentType, ContextType, RequireFields<MutationCreateDigitalOceanServerArgs, 'serverName'>>,
  createApp?: Resolver<ResolversTypes['App'], ParentType, ContextType, RequireFields<MutationCreateAppArgs, 'input'>>,
  createDatabase?: Resolver<ResolversTypes['Database'], ParentType, ContextType, RequireFields<MutationCreateDatabaseArgs, 'input'>>,
  updateServerInfo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateServerInfoArgs, 'serverId'>>,
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type Resolvers<ContextType = any> = {
  Server?: ServerResolvers<ContextType>,
  App?: AppResolvers<ContextType>,
  Database?: DatabaseResolvers<ContextType>,
  LoginResult?: LoginResultResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Upload?: GraphQLScalarType,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
