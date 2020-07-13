import React, { useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { GitHub } from 'react-feather';
import { config } from '../config';
import {
  useSetupQuery,
  useLoginWithGithubMutation,
} from '../generated/graphql';
import { useAuth } from '../modules/auth/AuthContext';
import { Terminal, Spinner, Button } from '../ui';

export const Home = () => {
  const history = useHistory();
  const { loggedIn, login } = useAuth();
  const { data, loading, error } = useSetupQuery({});
  const [loginWithGithubMutation] = useLoginWithGithubMutation();
  const [isSpinnerVisible, setIsSpinnverVisilble] = useState(false);

  // On mount we check if there is a github code present
  useEffect(() => {
    const codeToLogin = async () => {
      const githubCode = window.location.search
        .substring(1)
        .split('&')[0]
        .split('code=')[1];

      if (githubCode) {
        setIsSpinnverVisilble(true);
        // TODO show loading during login
        // Remove hash in url
        window.history.replaceState({}, document.title, '.');
        const data = await loginWithGithubMutation({
          variables: { code: githubCode },
        });
        // TODO handle errors
        if (data.data) {
          login(data.data.loginWithGithub.token);
          history.push('/dashboard');
        }
      }
    };

    codeToLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    setIsSpinnverVisilble(true);
    // TODO redirect_uri only on localhost
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&scope=user:email&redirect_uri=http://localhost:3000/`
    );
  };

  // We check if the user is connected, if yes we need to redirect him to the dashboard
  if (loggedIn) {
    return <Redirect to="dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Ledokku</h1>

      {error && <p className="mt-3 text-red-500">{error.message}</p>}

      {/* TODO display spinner if query is loading */}
      {loading && <Spinner size="large" />}

      {data?.setup.canConnectSsh === true && isSpinnerVisible ? (
        <Spinner size="large" />
      ) : (
        <React.Fragment>
          <p className="mt-3 mb-3">Login to get started.</p>

          <Button
            width="large"
            color="grey"
            onClick={handleLogin}
            iconStart={<GitHub />}
          >
            Log in with Github
          </Button>
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
