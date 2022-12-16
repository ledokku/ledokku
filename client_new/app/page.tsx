import { ApolloError } from "@apollo/client";
import { CantConectSshScreen } from "./components/CantConnectSshScreen";
import { Login } from "./components/Login";
import { Logo } from "./components/Logo";
import { Redirect } from "./components/Redirect";
import { LoginWithGithubDocument, LoginWithGithubMutation, LoginWithGithubMutationVariables, SetupDocument, SetupQuery } from "./generated/graphql";
import apolloClient from "./lib/apolloClient";

export default async function Page({ searchParams }: { searchParams?: { code: string, state: string } }) {
    let error = undefined;

    if (searchParams && "code" in searchParams) {
        if (searchParams.state === 'github_login' && searchParams.code) {
            try {
                const { data, error: mError } = await apolloClient.mutate({
                    mutation: LoginWithGithubDocument,
                    variables: {
                        code: searchParams.code
                    } as LoginWithGithubMutationVariables
                }) as { data: LoginWithGithubMutation, error?: ApolloError }

                if (data?.loginWithGithub) {
                    return <Redirect
                        ifAuth
                        route="/dashboard"
                        setCookieOnRedirect={["accessToken", data.loginWithGithub.token]} />
                } else if (mError) {
                    error = mError?.message ?? "Error al iniciar sesión";
                }
            } catch (err: any) {
                error = err.message;
            }
        }
    }

    const setup = await apolloClient.query({
        query: SetupDocument,
    }) as { data: SetupQuery, error?: ApolloError }

    return <Redirect route="/dashboard" ifAuth >
        <div className="container mx-auto">
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="text-red-500">{setup.error?.message}</div>
                <Logo size={150} />
                {
                    setup.data.setup.canConnectSsh === true && <>
                        <Login />
                        <div className="text-red-500 mt-4">{error}</div>
                    </>
                }

                {setup.data.setup.canConnectSsh === false && (
                    <CantConectSshScreen sshKey={setup.data.setup.sshPublicKey} />
                )}
            </div>
        </div>
    </Redirect >
}