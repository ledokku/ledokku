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
  | 'AWS'
  | 'DIGITALOCEAN'
  | 'LINODE';

export type ServerStatus = 
  | 'NEW'
  | 'ACTIVE'
  | 'OFF'
  | 'ARCHIVE';

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

export type CreateAppInput = {
  serverId: Scalars['String'];
  name: Scalars['String'];
  gitUrl: Scalars['String'];
};

export type CreateDatabaseInput = {
  serverId: Scalars['String'];
  name: Scalars['String'];
  type: DatabaseTypes;
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
  deleteDigitalOceanServer?: Maybe<Scalars['Boolean']>;
  createApp: CreateAppResult;
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


export type MutationDeleteDigitalOceanServerArgs = {
  serverId: Scalars['String'];
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
  | 'PUBLIC'
  | 'PRIVATE';


export type CreateAppMutationVariables = {
  serverId: Scalars['String'];
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

export type CreateDigitalOceanServerMutationVariables = {
  serverName: Scalars['String'];
};


export type CreateDigitalOceanServerMutation = (
  { __typename?: 'Mutation' }
  & { createDigitalOceanServer: (
    { __typename?: 'Server' }
    & Pick<Server, 'id'>
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

export type SaveDigitalOceanAccessTokenMutationVariables = {
  digitalOceanAccessToken: Scalars['String'];
};


export type SaveDigitalOceanAccessTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'saveDigitalOceanAccessToken'>
);

export type DashboardQueryVariables = {};


export type DashboardQuery = (
  { __typename?: 'Query' }
  & { servers?: Maybe<Array<(
    { __typename?: 'Server' }
    & Pick<Server, 'id' | 'name' | 'ip' | 'type'>
    & { apps?: Maybe<Array<(
      { __typename?: 'App' }
      & Pick<App, 'id' | 'name'>
    )>>, databases?: Maybe<Array<(
      { __typename?: 'Database' }
      & Pick<Database, 'id' | 'name'>
    )>> }
  )>> }
);

export type ServerByIdQueryVariables = {
  id: Scalars['String'];
};


export type ServerByIdQuery = (
  { __typename?: 'Query' }
  & { server?: Maybe<(
    { __typename?: 'Server' }
    & Pick<Server, 'id' | 'name' | 'ip' | 'type' | 'status'>
  )> }
);


export const CreateAppDocument = gql`
    mutation createApp($serverId: String!, $name: String!, $gitUrl: String!) {
  createApp(input: {serverId: $serverId, name: $name, gitUrl: $gitUrl}) {
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
 *      serverId: // value for 'serverId'
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
export const CreateDigitalOceanServerDocument = gql`
    mutation createDigitalOceanServer($serverName: String!) {
  createDigitalOceanServer(serverName: $serverName) {
    id
  }
}
    `;
export type CreateDigitalOceanServerMutationFn = ApolloReactCommon.MutationFunction<CreateDigitalOceanServerMutation, CreateDigitalOceanServerMutationVariables>;

/**
 * __useCreateDigitalOceanServerMutation__
 *
 * To run a mutation, you first call `useCreateDigitalOceanServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDigitalOceanServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDigitalOceanServerMutation, { data, loading, error }] = useCreateDigitalOceanServerMutation({
 *   variables: {
 *      serverName: // value for 'serverName'
 *   },
 * });
 */
export function useCreateDigitalOceanServerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDigitalOceanServerMutation, CreateDigitalOceanServerMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateDigitalOceanServerMutation, CreateDigitalOceanServerMutationVariables>(CreateDigitalOceanServerDocument, baseOptions);
      }
export type CreateDigitalOceanServerMutationHookResult = ReturnType<typeof useCreateDigitalOceanServerMutation>;
export type CreateDigitalOceanServerMutationResult = ApolloReactCommon.MutationResult<CreateDigitalOceanServerMutation>;
export type CreateDigitalOceanServerMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDigitalOceanServerMutation, CreateDigitalOceanServerMutationVariables>;
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
export const SaveDigitalOceanAccessTokenDocument = gql`
    mutation saveDigitalOceanAccessToken($digitalOceanAccessToken: String!) {
  saveDigitalOceanAccessToken(digitalOceanAccessToken: $digitalOceanAccessToken)
}
    `;
export type SaveDigitalOceanAccessTokenMutationFn = ApolloReactCommon.MutationFunction<SaveDigitalOceanAccessTokenMutation, SaveDigitalOceanAccessTokenMutationVariables>;

/**
 * __useSaveDigitalOceanAccessTokenMutation__
 *
 * To run a mutation, you first call `useSaveDigitalOceanAccessTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveDigitalOceanAccessTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveDigitalOceanAccessTokenMutation, { data, loading, error }] = useSaveDigitalOceanAccessTokenMutation({
 *   variables: {
 *      digitalOceanAccessToken: // value for 'digitalOceanAccessToken'
 *   },
 * });
 */
export function useSaveDigitalOceanAccessTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveDigitalOceanAccessTokenMutation, SaveDigitalOceanAccessTokenMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveDigitalOceanAccessTokenMutation, SaveDigitalOceanAccessTokenMutationVariables>(SaveDigitalOceanAccessTokenDocument, baseOptions);
      }
export type SaveDigitalOceanAccessTokenMutationHookResult = ReturnType<typeof useSaveDigitalOceanAccessTokenMutation>;
export type SaveDigitalOceanAccessTokenMutationResult = ApolloReactCommon.MutationResult<SaveDigitalOceanAccessTokenMutation>;
export type SaveDigitalOceanAccessTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveDigitalOceanAccessTokenMutation, SaveDigitalOceanAccessTokenMutationVariables>;
export const DashboardDocument = gql`
    query dashboard {
  servers {
    id
    name
    ip
    type
    apps {
      id
      name
    }
    databases {
      id
      name
    }
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
export const ServerByIdDocument = gql`
    query serverById($id: String!) {
  server(id: $id) {
    id
    name
    ip
    type
    status
  }
}
    `;

/**
 * __useServerByIdQuery__
 *
 * To run a query within a React component, call `useServerByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useServerByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServerByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useServerByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ServerByIdQuery, ServerByIdQueryVariables>) {
        return ApolloReactHooks.useQuery<ServerByIdQuery, ServerByIdQueryVariables>(ServerByIdDocument, baseOptions);
      }
export function useServerByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ServerByIdQuery, ServerByIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ServerByIdQuery, ServerByIdQueryVariables>(ServerByIdDocument, baseOptions);
        }
export type ServerByIdQueryHookResult = ReturnType<typeof useServerByIdQuery>;
export type ServerByIdLazyQueryHookResult = ReturnType<typeof useServerByIdLazyQuery>;
export type ServerByIdQueryResult = ApolloReactCommon.QueryResult<ServerByIdQuery, ServerByIdQueryVariables>;