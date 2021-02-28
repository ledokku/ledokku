import { useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Container,
} from '@chakra-ui/react';
import { config } from '../config';
import {
  useSetupQuery,
  useLoginWithGithubMutation,
} from '../generated/graphql';
import { useAuth } from '../modules/auth/AuthContext';
import { Terminal } from '../ui';

export const Home = () => {
  const history = useHistory();
  const { loggedIn, login } = useAuth();
  const { data, loading, error } = useSetupQuery({});
  const [loginWithGithubMutation] = useLoginWithGithubMutation();
  const [loggingIn, setLoggingIn] = useState(false);

  // On mount we check if there is a github code present
  useEffect(() => {
    const codeToLogin = async () => {
      const githubCode = window.location.search
        .substring(1)
        .split('&')[0]
        .split('code=')[1];

      if (githubCode) {
        setLoggingIn(true);
        // Remove hash in url
        window.history.replaceState({}, document.title, '.');
        const data = await loginWithGithubMutation({
          variables: { code: githubCode },
        });
        // TODO handle errors
        if (data.data?.loginWithGithub) {
          login(data.data.loginWithGithub.token);
          history.push('/dashboard');
        }
      }
    };

    codeToLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    setLoggingIn(true);
    // The redirect_uri parameter should only be used on production,
    // on dev env we force the redirection to localhost
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${
        config.githubClientId
      }&scope=user:email${
        config.environment === 'development'
          ? '&redirect_uri=http://localhost:3000/'
          : ''
      }`
    );
  };

  // We check if the user is connected, if yes we need to redirect him to the dashboard
  if (loggedIn) {
    return <Redirect to="dashboard" />;
  }

  return (
    <Container maxW="5xl">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Heading as="h2" size="lg">
          Ledokku
        </Heading>

        {error && (
          <Text mt={4} color="red.500">
            {error.message}
          </Text>
        )}

        {(loading || loggingIn) && <Spinner mt={4} />}

        {data?.setup.canConnectSsh === true && !loggingIn && (
          <>
            <Text>Login to get started.</Text>

            <Button
              mt={3}
              colorScheme="gray"
              onClick={handleLogin}
              leftIcon={<FiGithub size={18} />}
              size="lg"
            >
              Log in with Github
            </Button>
          </>
        )}

        {data?.setup.canConnectSsh === false && (
          <>
            <Text mt={4}>
              In order to setup the ssh connection, run the following command on
              your Dokku server.
            </Text>
            {/* TODO migrate terminal to chakra-ui */}
            <Terminal className="break-all">
              {`echo "${data.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
            </Terminal>
            <Text mt={3}>Once you are done, just refresh this page.</Text>
          </>
        )}
      </Box>
    </Container>
  );
};
