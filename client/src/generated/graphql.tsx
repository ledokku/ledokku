/* eslint-disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;

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
  githubRepoUrl: Scalars['String'];
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

export type CacheControlScope = 
  | 'PUBLIC'
  | 'PRIVATE';


export type CreateAppMutationVariables = {
  name: Scalars['String'];
  gitUrl: Scalars['String'];
};


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

export type CreateDatabaseMutationVariables = {
  input: CreateDatabaseInput;
};


export type CreateDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { createDatabase: (
    { __typename?: 'Database' }
    & Pick<Database, 'id' | 'name'>
  ) }
);

export type LoginWithGithubMutationVariables = {
  code: Scalars['String'];
};


export type LoginWithGithubMutation = (
  { __typename?: 'Mutation' }
  & { loginWithGithub?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'token'>
  )> }
);

export type AppByIdQueryVariables = {
  appId: Scalars['String'];
};


export type AppByIdQuery = (
  { __typename?: 'Query' }
  & { app?: Maybe<(
    { __typename?: 'App' }
    & Pick<App, 'id' | 'name' | 'githubRepoUrl'>
  )> }
);

export type AppLogsQueryVariables = {
  appId: Scalars['String'];
};


export type AppLogsQuery = (
  { __typename?: 'Query' }
  & { appLogs: (
    { __typename?: 'AppLogsResult' }
    & Pick<AppLogsResult, 'logs'>
  ) }
);

export type DashboardQueryVariables = {};


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
export const AppByIdDocument = gql`
    query appById($appId: String!) {
  app(appId: $appId) {
    id
    name
    githubRepoUrl
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