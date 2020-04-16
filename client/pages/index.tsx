import React, { useEffect } from 'react';
import { GitHub } from 'react-feather';
import { useRouter } from 'next/router';

import { LandingLayout } from '../layouts/LandingLayout';
import { Button } from '../ui/components/Button';
import { Headline } from '../ui/components/Typography/components/Headline';
import { Paragraph } from '../ui/components/Typography/components/Paragraph';
import { config } from '../config';
import withApollo from '../lib/withApollo';
import { useLoginWithGithubMutation } from '../src/generated/graphql';

const Home = () => {
  const router = useRouter();
  const [
    loginWithGithubMutation,
    { data, loading, error },
  ] = useLoginWithGithubMutation();

  // On mount we check if there is a github code present
  useEffect(() => {
    const login = async () => {
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
          localStorage.setItem('accessToken', data.data.loginWithGithub.token);
          router.push('/dashboard');
        }
      }
    };

    // First we check if the user is connected, if yes we need to redirect him to the dashboard
    const authToken = localStorage.getItem('accessToken');
    if (authToken) {
      router.push('/dashboard');
    } else {
      login();
    }
  }, []);

  const handleLogin = () => {
    // TODO redirect_uri only on localhost
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&scope=user:email&redirect_uri=http://localhost:3000/`
    );
  };

  return (
    <LandingLayout>
      <Headline level={1} marginTop={0} marginBottom={32} textAlign="center">
        Ledokku
      </Headline>
      <Paragraph marginTop={0} marginBottom={32} textAlign="center">
        Have you ever felt like creating a thing?
        <br />
        Well now you can!
      </Paragraph>
      <Button size="large" startIcon={<GitHub />} onClick={handleLogin}>
        Log in with Github
      </Button>
    </LandingLayout>
  );
};

export default withApollo(Home);
