/* eslint-disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

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

export type CacheControlScope = 
  | 'PUBLIC'
  | 'PRIVATE';


export type CreateAppMutationVariables = Exact<{
  name: Scalars['String'];
  gitUrl: Scalars['String'];
}>;


export type CreateAppMutation = (
  { __typename?: 'Mutation' }
  & { createApp: (
    { __typename?: 'CreateAppResult' }
    & { app: (
      { __typename?: 'App' }
      & Pick<App, 'id'>
    ), appBuild: (
      { __typename?: 'AppBuild' }
      & Pick<AppBuild, 'id'>
    ) }
  ) }
);

export type CreateDatabaseMutationVariables = Exact<{
  input: CreateDatabaseInput;
}>;


export type CreateDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { createDatabase: (
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name'>
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

export type DestroyDatabaseMutationVariables = {
  input: DestroyDatabaseInput;
};


export type DestroyDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { destroyDatabase: (
    { __typename?: 'DestroyDatabaseResult' }
    & Pick<DestroyDatabaseResult, 'result'>
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
    & Pick<App, 'id' | 'name' | 'githubRepoUrl' | 'createdAt'>
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

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { apps: Array<(
    { __typename?: 'App' }
    & Pick<App, 'id' | 'name'>
  )>, databases: Array<(
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name' | 'type'>
  )> }
);

export type DatabaseByIdQueryVariables = {
  databaseId: Scalars['String'];
};


export type DatabaseByIdQuery = (
  { __typename?: 'Query' }
  & { database?: Maybe<(
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name' | 'type'>
  )> }
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

export type SetupQueryVariables = Exact<{ [key: string]: never; }>;


export type SetupQuery = (
  { __typename?: 'Query' }
  & { setup: (
    { __typename?: 'SetupResult' }
    & Pick<SetupResult, 'canConnectSsh' | 'sshPublicKey'>
  ) }
);


export const CreateAppDocument = gql`
    mutation createApp($name: String!, $gitUrl: String!) {
  createApp(input: {name: $name, gitUrl: $gitUrl}) {
    app {
      id
    }
    appBuild {
      id
    }
  }
}
    `;
export type CreateAppMutationFn = ApolloReactCommon.MutationFunction<CreateAppMutation, CreateAppMutationVariables>;

/**
 * __useCreateAppMutation__
 *
 * To run a mutation, you first call `useCreateAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppMutation, { data, loading, error }] = useCreateAppMutation({
 *   variables: {
 *      name: // value for 'name'
 *      gitUrl: // value for 'gitUrl'
 *   },
 * });
 */
export function useCreateAppMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAppMutation, CreateAppMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateAppMutation, CreateAppMutationVariables>(CreateAppDocument, baseOptions);
      }
export type CreateAppMutationHookResult = ReturnType<typeof useCreateAppMutation>;
export type CreateAppMutationResult = ApolloReactCommon.MutationResult<CreateAppMutation>;
export type CreateAppMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateAppMutation, CreateAppMutationVariables>;
export const CreateDatabaseDocument = gql`
    mutation createDatabase($input: CreateDatabaseInput!) {
  createDatabase(input: $input) {
    id
    name
  }
}
    `;
export type CreateDatabaseMutationFn = ApolloReactCommon.MutationFunction<CreateDatabaseMutation, CreateDatabaseMutationVariables>;

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
export function useCreateDatabaseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDatabaseMutation, CreateDatabaseMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateDatabaseMutation, CreateDatabaseMutationVariables>(CreateDatabaseDocument, baseOptions);
      }
export type CreateDatabaseMutationHookResult = ReturnType<typeof useCreateDatabaseMutation>;
export type CreateDatabaseMutationResult = ApolloReactCommon.MutationResult<CreateDatabaseMutation>;
export type CreateDatabaseMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDatabaseMutation, CreateDatabaseMutationVariables>;
export const DestroyAppDocument = gql`
    mutation destroyApp($input: DestroyAppInput!) {
  destroyApp(input: $input) {
    result
  }
}
    `;
export type DestroyAppMutationFn = ApolloReactCommon.MutationFunction<DestroyAppMutation, DestroyAppMutationVariables>;

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
export function useDestroyAppMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DestroyAppMutation, DestroyAppMutationVariables>) {
        return ApolloReactHooks.useMutation<DestroyAppMutation, DestroyAppMutationVariables>(DestroyAppDocument, baseOptions);
      }
export type DestroyAppMutationHookResult = ReturnType<typeof useDestroyAppMutation>;
export type DestroyAppMutationResult = ApolloReactCommon.MutationResult<DestroyAppMutation>;
export type DestroyAppMutationOptions = ApolloReactCommon.BaseMutationOptions<DestroyAppMutation, DestroyAppMutationVariables>;
export const DestroyDatabaseDocument = gql`
    mutation destroyDatabase($input: DestroyDatabaseInput!) {
  destroyDatabase(input: $input) {
    result
  }
}
    `;
export type DestroyDatabaseMutationFn = ApolloReactCommon.MutationFunction<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>;

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
export function useDestroyDatabaseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>) {
        return ApolloReactHooks.useMutation<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>(DestroyDatabaseDocument, baseOptions);
      }
export type DestroyDatabaseMutationHookResult = ReturnType<typeof useDestroyDatabaseMutation>;
export type DestroyDatabaseMutationResult = ApolloReactCommon.MutationResult<DestroyDatabaseMutation>;
export type DestroyDatabaseMutationOptions = ApolloReactCommon.BaseMutationOptions<DestroyDatabaseMutation, DestroyDatabaseMutationVariables>;
export const LoginWithGithubDocument = gql`
    mutation loginWithGithub($code: String!) {
  loginWithGithub(code: $code) {
    token
  }
}
    `;
export type LoginWithGithubMutationFn = ApolloReactCommon.MutationFunction<LoginWithGithubMutation, LoginWithGithubMutationVariables>;

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
export function useLoginWithGithubMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginWithGithubMutation, LoginWithGithubMutationVariables>(LoginWithGithubDocument, baseOptions);
      }
export type LoginWithGithubMutationHookResult = ReturnType<typeof useLoginWithGithubMutation>;
export type LoginWithGithubMutationResult = ApolloReactCommon.MutationResult<LoginWithGithubMutation>;
export type LoginWithGithubMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>;
export const SetEnvVarDocument = gql`
    mutation setEnvVar($key: String!, $value: String!, $appId: String!) {
  setEnvVar(input: {key: $key, value: $value, appId: $appId}) {
    result
  }
}
    `;
export type SetEnvVarMutationFn = ApolloReactCommon.MutationFunction<SetEnvVarMutation, SetEnvVarMutationVariables>;

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
export function useSetEnvVarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetEnvVarMutation, SetEnvVarMutationVariables>) {
        return ApolloReactHooks.useMutation<SetEnvVarMutation, SetEnvVarMutationVariables>(SetEnvVarDocument, baseOptions);
      }
export type SetEnvVarMutationHookResult = ReturnType<typeof useSetEnvVarMutation>;
export type SetEnvVarMutationResult = ApolloReactCommon.MutationResult<SetEnvVarMutation>;
export type SetEnvVarMutationOptions = ApolloReactCommon.BaseMutationOptions<SetEnvVarMutation, SetEnvVarMutationVariables>;
export const UnsetEnvVarDocument = gql`
    mutation unsetEnvVar($key: String!, $appId: String!) {
  unsetEnvVar(input: {key: $key, appId: $appId}) {
    result
  }
}
    `;
export type UnsetEnvVarMutationFn = ApolloReactCommon.MutationFunction<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>;

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
export function useUnsetEnvVarMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>) {
        return ApolloReactHooks.useMutation<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>(UnsetEnvVarDocument, baseOptions);
      }
export type UnsetEnvVarMutationHookResult = ReturnType<typeof useUnsetEnvVarMutation>;
export type UnsetEnvVarMutationResult = ApolloReactCommon.MutationResult<UnsetEnvVarMutation>;
export type UnsetEnvVarMutationOptions = ApolloReactCommon.BaseMutationOptions<UnsetEnvVarMutation, UnsetEnvVarMutationVariables>;
export const AppByIdDocument = gql`
    query appById($appId: String!) {
  app(appId: $appId) {
    id
    name
    githubRepoUrl
    createdAt
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
export function useAppByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AppByIdQuery, AppByIdQueryVariables>) {
        return ApolloReactHooks.useQuery<AppByIdQuery, AppByIdQueryVariables>(AppByIdDocument, baseOptions);
      }
export function useAppByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AppByIdQuery, AppByIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<AppByIdQuery, AppByIdQueryVariables>(AppByIdDocument, baseOptions);
        }
export type AppByIdQueryHookResult = ReturnType<typeof useAppByIdQuery>;
export type AppByIdLazyQueryHookResult = ReturnType<typeof useAppByIdLazyQuery>;
export type AppByIdQueryResult = ApolloReactCommon.QueryResult<AppByIdQuery, AppByIdQueryVariables>;
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
export function useAppLogsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AppLogsQuery, AppLogsQueryVariables>) {
        return ApolloReactHooks.useQuery<AppLogsQuery, AppLogsQueryVariables>(AppLogsDocument, baseOptions);
      }
export function useAppLogsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AppLogsQuery, AppLogsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<AppLogsQuery, AppLogsQueryVariables>(AppLogsDocument, baseOptions);
        }
export type AppLogsQueryHookResult = ReturnType<typeof useAppLogsQuery>;
export type AppLogsLazyQueryHookResult = ReturnType<typeof useAppLogsLazyQuery>;
export type AppLogsQueryResult = ApolloReactCommon.QueryResult<AppLogsQuery, AppLogsQueryVariables>;
export const DashboardDocument = gql`
    query dashboard {
  apps {
    id
    name
  }
  databases {
    id
    name
    type
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
export function useDashboardQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
        return ApolloReactHooks.useQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, baseOptions);
      }
export function useDashboardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, baseOptions);
        }
export type DashboardQueryHookResult = ReturnType<typeof useDashboardQuery>;
export type DashboardLazyQueryHookResult = ReturnType<typeof useDashboardLazyQuery>;
export type DashboardQueryResult = ApolloReactCommon.QueryResult<DashboardQuery, DashboardQueryVariables>;
export const DatabaseByIdDocument = gql`
    query databaseById($databaseId: String!) {
  database(databaseId: $databaseId) {
    id
    name
    type
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
export function useDatabaseByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DatabaseByIdQuery, DatabaseByIdQueryVariables>) {
        return ApolloReactHooks.useQuery<DatabaseByIdQuery, DatabaseByIdQueryVariables>(DatabaseByIdDocument, baseOptions);
      }
export function useDatabaseByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DatabaseByIdQuery, DatabaseByIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<DatabaseByIdQuery, DatabaseByIdQueryVariables>(DatabaseByIdDocument, baseOptions);
        }
export type DatabaseByIdQueryHookResult = ReturnType<typeof useDatabaseByIdQuery>;
export type DatabaseByIdLazyQueryHookResult = ReturnType<typeof useDatabaseByIdLazyQuery>;
export type DatabaseByIdQueryResult = ApolloReactCommon.QueryResult<DatabaseByIdQuery, DatabaseByIdQueryVariables>;
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
export function useEnvVarsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
        return ApolloReactHooks.useQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, baseOptions);
      }
export function useEnvVarsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, baseOptions);
        }
export type EnvVarsQueryHookResult = ReturnType<typeof useEnvVarsQuery>;
export type EnvVarsLazyQueryHookResult = ReturnType<typeof useEnvVarsLazyQuery>;
export type EnvVarsQueryResult = ApolloReactCommon.QueryResult<EnvVarsQuery, EnvVarsQueryVariables>;
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
export function useIsPluginInstalledQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
        return ApolloReactHooks.useQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, baseOptions);
      }
export function useIsPluginInstalledLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, baseOptions);
        }
export type IsPluginInstalledQueryHookResult = ReturnType<typeof useIsPluginInstalledQuery>;
export type IsPluginInstalledLazyQueryHookResult = ReturnType<typeof useIsPluginInstalledLazyQuery>;
export type IsPluginInstalledQueryResult = ApolloReactCommon.QueryResult<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>;
export const SetupDocument = gql`
    query setup {
  setup {
    canConnectSsh
    sshPublicKey
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
export function useSetupQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SetupQuery, SetupQueryVariables>) {
        return ApolloReactHooks.useQuery<SetupQuery, SetupQueryVariables>(SetupDocument, baseOptions);
      }
export function useSetupLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SetupQuery, SetupQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SetupQuery, SetupQueryVariables>(SetupDocument, baseOptions);
        }
export type SetupQueryHookResult = ReturnType<typeof useSetupQuery>;
export type SetupLazyQueryHookResult = ReturnType<typeof useSetupLazyQuery>;
export type SetupQueryResult = ApolloReactCommon.QueryResult<SetupQuery, SetupQueryVariables>;