import { GITHUB_APP_CLIENT_ID, GITHUB_APP_SECRET } from '@/constants';
import { serverClient } from '@/lib/apollo.server';
import { ApolloError } from '@apollo/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: GITHUB_APP_CLIENT_ID,
            clientSecret: GITHUB_APP_SECRET,
        }),
    ],
    pages: {
        signIn: '/',
        error: '/',
        signOut: '/',
        newUser: '/dashboard',
    },
    callbacks: {
        async signIn({ account }) {
            if (account) {
                delete account.scope;

                const accessToken = await serverClient
                    .loginWithGithubAccessToken({
                        input: account as any,
                    })
                    .then((res) => res.loginWithGithubAccessToken.token)
                    .catch((e: ApolloError) => {
                        throw new Error(e.message);
                    });

                account.innerAccessToken = accessToken;
            }

            return true;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.innerAccessToken;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken as string;

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
