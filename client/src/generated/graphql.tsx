/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
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
  createdAt: Scalars['DateTime'];
  apps?: Maybe<Array<App>>;
};

export type DatabaseTypes = 
  | 'REDIS'
  | 'POSTGRESQL'
  | 'MONGODB'
  | 'MYSQL';

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
  app: App;
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
  appProxyPorts: Array<AppProxyPort>;
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


export type QueryAppProxyPortsArgs = {
  appId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  unlinkDatabaseLogs: RealTimeLog;
  linkDatabaseLogs: RealTimeLog;
  createDatabaseLogs: RealTimeLog;
};

export type Mutation = {
  __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  createApp: CreateAppResult;
  createDatabase: CreateDatabaseResult;
  setEnvVar: SetEnvVarResult;
  unsetEnvVar: UnsetEnvVarResult;
  destroyApp: DestroyAppResult;
  destroyDatabase: DestroyDatabaseResult;
  linkDatabase: LinkDatabaseResult;
  unlinkDatabase: UnlinkDatabaseResult;
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


export type MutationUnlinkDatabaseArgs = {
  input: UnlinkDatabaseInput;
};

export type CacheControlScope = 
  | 'PUBLIC'
  | 'PRIVATE';


export type CreateAppMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateAppMutation = (
  { __typename?: 'Mutation' }
  & { createApp: (
    { __typename?: 'CreateAppResult' }
    & { app: (
      { __typename?: 'App' }
      & Pick<App, 'id'>
    ) }
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
    )>> }
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

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { apps: Array<(
    { __typename?: 'App' }
    & Pick<App, 'id' | 'name' | 'createdAt'>
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
    & Pick<Database, 'id' | 'name' | 'type'>
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

export type UnlinkDatabaseLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UnlinkDatabaseLogsSubscription = (
  { __typename?: 'Subscription' }
  & { unlinkDatabaseLogs: (
    { __typename?: 'RealTimeLog' }
    & Pick<RealTimeLog, 'message' | 'type'>
  ) }
);


export const CreateAppDocument = gql`
    mutation createApp($name: String!) {
  createApp(input: {name: $name}) {
    app {
      id
    }
  }
}
    `;
export type CreateAppMutationFn = Apollo.MutationFunction<CreateAppMutation, CreateAppMutationVariables>;

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
 *   },
 * });
 */
export function useCreateAppMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppMutation, CreateAppMutationVariables>) {
        return Apollo.useMutation<CreateAppMutation, CreateAppMutationVariables>(CreateAppDocument, baseOptions);
      }
export type CreateAppMutationHookResult = ReturnType<typeof useCreateAppMutation>;
export type CreateAppMutationResult = Apollo.MutationResult<CreateAppMutation>;
export type CreateAppMutationOptions = Apollo.BaseMutationOptions<CreateAppMutation, CreateAppMutationVariables>;
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
export function useAppByIdQuery(baseOptions?: Apollo.QueryHookOptions<AppByIdQuery, AppByIdQueryVariables>) {
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
export function useAppLogsQuery(baseOptions?: Apollo.QueryHookOptions<AppLogsQuery, AppLogsQueryVariables>) {
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
export function useAppProxyPortsQuery(baseOptions?: Apollo.QueryHookOptions<AppProxyPortsQuery, AppProxyPortsQueryVariables>) {
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
export const DashboardDocument = gql`
    query dashboard {
  apps {
    id
    name
    createdAt
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
export function useDatabaseByIdQuery(baseOptions?: Apollo.QueryHookOptions<DatabaseByIdQuery, DatabaseByIdQueryVariables>) {
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
export function useDatabaseInfoQuery(baseOptions?: Apollo.QueryHookOptions<DatabaseInfoQuery, DatabaseInfoQueryVariables>) {
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
export function useDatabaseLogsQuery(baseOptions?: Apollo.QueryHookOptions<DatabaseLogsQuery, DatabaseLogsQueryVariables>) {
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
export function useEnvVarsQuery(baseOptions?: Apollo.QueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
        return Apollo.useQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, baseOptions);
      }
export function useEnvVarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnvVarsQuery, EnvVarsQueryVariables>) {
          return Apollo.useLazyQuery<EnvVarsQuery, EnvVarsQueryVariables>(EnvVarsDocument, baseOptions);
        }
export type EnvVarsQueryHookResult = ReturnType<typeof useEnvVarsQuery>;
export type EnvVarsLazyQueryHookResult = ReturnType<typeof useEnvVarsLazyQuery>;
export type EnvVarsQueryResult = Apollo.QueryResult<EnvVarsQuery, EnvVarsQueryVariables>;
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
export function useIsPluginInstalledQuery(baseOptions?: Apollo.QueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
        return Apollo.useQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, baseOptions);
      }
export function useIsPluginInstalledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>) {
          return Apollo.useLazyQuery<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>(IsPluginInstalledDocument, baseOptions);
        }
export type IsPluginInstalledQueryHookResult = ReturnType<typeof useIsPluginInstalledQuery>;
export type IsPluginInstalledLazyQueryHookResult = ReturnType<typeof useIsPluginInstalledLazyQuery>;
export type IsPluginInstalledQueryResult = Apollo.QueryResult<IsPluginInstalledQuery, IsPluginInstalledQueryVariables>;
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
export function useSetupQuery(baseOptions?: Apollo.QueryHookOptions<SetupQuery, SetupQueryVariables>) {
        return Apollo.useQuery<SetupQuery, SetupQueryVariables>(SetupDocument, baseOptions);
      }
export function useSetupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SetupQuery, SetupQueryVariables>) {
          return Apollo.useLazyQuery<SetupQuery, SetupQueryVariables>(SetupDocument, baseOptions);
        }
export type SetupQueryHookResult = ReturnType<typeof useSetupQuery>;
export type SetupLazyQueryHookResult = ReturnType<typeof useSetupLazyQuery>;
export type SetupQueryResult = Apollo.QueryResult<SetupQuery, SetupQueryVariables>;
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