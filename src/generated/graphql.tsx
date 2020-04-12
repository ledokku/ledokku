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
  ip: Scalars['String'];
  apps?: Maybe<Array<App>>;
  databases?: Maybe<Array<Database>>;
};

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

export type Query = {
  __typename?: 'Query';
  servers?: Maybe<Array<Server>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  saveDigitalOceanAccessToken?: Maybe<Scalars['Boolean']>;
  createDigitalOceanServer?: Maybe<Scalars['Boolean']>;
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

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type CreateDigitalOceanServerMutationVariables = {
  serverName: Scalars['String'];
};

export type CreateDigitalOceanServerMutation = {
  __typename?: 'Mutation';
} & Pick<Mutation, 'createDigitalOceanServer'>;

export type LoginWithGithubMutationVariables = {
  code: Scalars['String'];
};

export type LoginWithGithubMutation = { __typename?: 'Mutation' } & {
  loginWithGithub?: Maybe<
    { __typename?: 'LoginResult' } & Pick<LoginResult, 'token'>
  >;
};

export type SaveDigitalOceanAccessTokenMutationVariables = {
  digitalOceanAccessToken: Scalars['String'];
};

export type SaveDigitalOceanAccessTokenMutation = {
  __typename?: 'Mutation';
} & Pick<Mutation, 'saveDigitalOceanAccessToken'>;

export const CreateDigitalOceanServerDocument = gql`
  mutation createDigitalOceanServer($serverName: String!) {
    createDigitalOceanServer(serverName: $serverName)
  }
`;
export type CreateDigitalOceanServerMutationFn = ApolloReactCommon.MutationFunction<
  CreateDigitalOceanServerMutation,
  CreateDigitalOceanServerMutationVariables
>;

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
export function useCreateDigitalOceanServerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateDigitalOceanServerMutation,
    CreateDigitalOceanServerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateDigitalOceanServerMutation,
    CreateDigitalOceanServerMutationVariables
  >(CreateDigitalOceanServerDocument, baseOptions);
}
export type CreateDigitalOceanServerMutationHookResult = ReturnType<
  typeof useCreateDigitalOceanServerMutation
>;
export type CreateDigitalOceanServerMutationResult = ApolloReactCommon.MutationResult<
  CreateDigitalOceanServerMutation
>;
export type CreateDigitalOceanServerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateDigitalOceanServerMutation,
  CreateDigitalOceanServerMutationVariables
>;
export const LoginWithGithubDocument = gql`
  mutation loginWithGithub($code: String!) {
    loginWithGithub(code: $code) {
      token
    }
  }
`;
export type LoginWithGithubMutationFn = ApolloReactCommon.MutationFunction<
  LoginWithGithubMutation,
  LoginWithGithubMutationVariables
>;

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
export function useLoginWithGithubMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LoginWithGithubMutation,
    LoginWithGithubMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    LoginWithGithubMutation,
    LoginWithGithubMutationVariables
  >(LoginWithGithubDocument, baseOptions);
}
export type LoginWithGithubMutationHookResult = ReturnType<
  typeof useLoginWithGithubMutation
>;
export type LoginWithGithubMutationResult = ApolloReactCommon.MutationResult<
  LoginWithGithubMutation
>;
export type LoginWithGithubMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginWithGithubMutation,
  LoginWithGithubMutationVariables
>;
export const SaveDigitalOceanAccessTokenDocument = gql`
  mutation saveDigitalOceanAccessToken($digitalOceanAccessToken: String!) {
    saveDigitalOceanAccessToken(
      digitalOceanAccessToken: $digitalOceanAccessToken
    )
  }
`;
export type SaveDigitalOceanAccessTokenMutationFn = ApolloReactCommon.MutationFunction<
  SaveDigitalOceanAccessTokenMutation,
  SaveDigitalOceanAccessTokenMutationVariables
>;

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
export function useSaveDigitalOceanAccessTokenMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SaveDigitalOceanAccessTokenMutation,
    SaveDigitalOceanAccessTokenMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SaveDigitalOceanAccessTokenMutation,
    SaveDigitalOceanAccessTokenMutationVariables
  >(SaveDigitalOceanAccessTokenDocument, baseOptions);
}
export type SaveDigitalOceanAccessTokenMutationHookResult = ReturnType<
  typeof useSaveDigitalOceanAccessTokenMutation
>;
export type SaveDigitalOceanAccessTokenMutationResult = ApolloReactCommon.MutationResult<
  SaveDigitalOceanAccessTokenMutation
>;
export type SaveDigitalOceanAccessTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SaveDigitalOceanAccessTokenMutation,
  SaveDigitalOceanAccessTokenMutationVariables
>;
