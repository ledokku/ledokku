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

export type Book = {
  __typename?: 'Book';
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  books?: Maybe<Array<Maybe<Book>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  loginWithGithub?: Maybe<LoginResult>;
  saveDigitalOceanAccessToken?: Maybe<Scalars['Boolean']>;
};

export type MutationLoginWithGithubArgs = {
  code: Scalars['String'];
};

export type MutationSaveDigitalOceanAccessTokenArgs = {
  digitalOceanAccessToken: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type LoginWithGithubMutationVariables = {
  code: Scalars['String'];
};

export type LoginWithGithubMutation = { __typename?: 'Mutation' } & {
  loginWithGithub?: Maybe<
    { __typename?: 'LoginResult' } & Pick<LoginResult, 'token'>
  >;
};

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
