import React, { useEffect } from 'react';
import { GitHub } from 'react-feather';
import { useRouter } from 'next/router';

import { config } from '../config';
import withApollo from '../lib/withApollo';
import { useLoginWithGithubMutation } from '../generated/graphql';
import { useAuth } from '../modules/auth/AuthContext';

const Home = () => {
  const router = useRouter();
  const { loggedIn, login } = useAuth();
  const [
    loginWithGithubMutation,
    { data, loading, error },
  ] = useLoginWithGithubMutation();

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
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Ledokku</h1>
      <p className="mt-3">Login to get started.</p>
      <button
        className="flex mt-4 p-3 rounded bg-black text-white transition-all duration-100 hover:opacity-75 focus:scale-95"
        // onClick={handleLogin}
      >
        <GitHub className="mr-4" /> Log in with Github
      </button>
    </div>
  );
};

export default withApollo(Home);
