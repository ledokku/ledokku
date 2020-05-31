import React, { useEffect } from 'react';
import { GitHub } from 'react-feather';
import { useRouter } from 'next/router';

import { config } from '../config';
import withApollo from '../lib/withApollo';
import {
  useSetupQuery,
  useLoginWithGithubMutation,
} from '../generated/graphql';
import { useAuth } from '../modules/auth/AuthContext';
import { Terminal } from '../ui';

const Home = () => {
  const router = useRouter();
  const { loggedIn, login } = useAuth();
  const { data, loading, error } = useSetupQuery({});
  const [loginWithGithubMutation] = useLoginWithGithubMutation();

  // On mount we check if there is a github code present
  useEffect(() => {
    const codeToLogin = async () => {
      const githubCode = window.location.search
        .substring(1)
        .split('&')[0]
        .split('code=')[1];

      if (githubCode) {
        // TODO show loading during login
        // Remove hash in url
        window.history.replaceState({}, document.title, '.');
        const data = await loginWithGithubMutation({
          variables: { code: githubCode },
        });
        // TODO handle errors
        if (data.data) {
          login(data.data.loginWithGithub.token);
          router.push('/dashboard');
        }
      }
    };

    codeToLogin();
  }, []);

  // We check if the user is connected, if yes we need to redirect him to the dashboard
  if (loggedIn) {
    router.push('/dashboard');
  }

  const handleLogin = () => {
    // TODO redirect_uri only on localhost
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&scope=user:email&redirect_uri=http://localhost:3000/`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Ledokku</h1>
      {error && <p className="mt-3 text-red-500">{error.message}</p>}

      {data?.setup.canConnectSsh === true && (
        <React.Fragment>
          <p className="mt-3">Login to get started.</p>
          <button
            className="flex mt-4 px-4 py-3 rounded bg-black hover:bg-gray-900 text-white transition ease-in-out duration-150"
            onClick={handleLogin}
          >
            <GitHub className="mr-4" /> Log in with Github
          </button>
        </React.Fragment>
      )}

      {data?.setup.canConnectSsh === false && (
        <React.Fragment>
          <p className="mt-3">
            In order to setup the ssh connection, run the following command on
            your Dokku server.
          </p>
          <Terminal className="break-all">
            {`echo "${data.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
          </Terminal>
          <p className="mt-3">Once you are done, just refresh this page.</p>
        </React.Fragment>
      )}
    </div>
  );
};

export default withApollo(Home);
