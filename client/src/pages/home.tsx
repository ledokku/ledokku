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
  Alert,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { config } from '../config';
import {
  useSetupQuery,
  useRegisterGithubAppMutation,
  useLoginWithGithubMutation,
} from '../generated/graphql';
import { useAuth } from '../modules/auth/AuthContext';
import { Terminal } from '../ui';
import { useToast } from '../ui/toast';

export const Home = () => {
  const toast = useToast();
  const history = useHistory();
  const { loggedIn, login } = useAuth();
  const { data, loading, error, refetch: refetchSetup } = useSetupQuery({});
  const [registerGithubAppMutation] = useRegisterGithubAppMutation();
  const [loginWithGithubMutation] = useLoginWithGithubMutation();
  const [loggingIn, setLoggingIn] = useState(false);
  const [showAppSuccessAlert, setShowAppSuccessAlert] = useState(false);

  // On mount we check if there is a github code present
  useEffect(() => {
    const codeToLogin = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const githubCode = urlParams.get('code');
      const githubState = urlParams.get('state');

      // In case of login state is empty
      if (githubState === 'github_login' && githubCode) {
        setLoggingIn(true);
        // Remove hash in url
        window.history.replaceState({}, document.title, '.');
        try {
          const data = await loginWithGithubMutation({
            variables: { code: githubCode },
          });
          if (data.data?.loginWithGithub) {
            login(data.data.loginWithGithub.token);
            history.push('/dashboard');
          }
        } catch (error) {
          toast.error(error.message);
        }

        return;
      }

      if (githubState === 'github_application_setup' && githubCode) {
        // Remove hash in url
        window.history.replaceState({}, document.title, '.');
        try {
          const data = await registerGithubAppMutation({
            variables: { code: githubCode },
          });
          if (data.data?.registerGithubApp?.githubAppClientId) {
            config.githubClientId =
              data.data?.registerGithubApp?.githubAppClientId;

            setShowAppSuccessAlert(true);

            await refetchSetup();
          }
        } catch (error) {
          toast.error(error.message);
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
      `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&state=github_login`
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

        {data?.setup.canConnectSsh === false && (
          <>
            <Text mt={4}>
              In order to setup the ssh connection, run the following command on
              your Dokku server.
            </Text>
            <Terminal wordBreak="break-all">
              {`echo "${data.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
            </Terminal>
            <Text mt={3}>Once you are done, just refresh this page.</Text>
          </>
        )}

        {data?.setup.canConnectSsh === true &&
          data?.setup.isGithubAppSetup === false && (
            <Box
              maxWidth="xl"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text mt={4} textAlign="center">
                In order to be able to login and interact with the Github API,
                let's create a new Github Application.
              </Text>
              <form
                action="https://github.com/settings/apps/new?state=github_application_setup"
                method="post"
              >
                <input
                  type="text"
                  name="manifest"
                  id="manifest"
                  defaultValue={data.setup.githubAppManifest}
                  style={{ display: 'none' }}
                />
                <Button
                  mt={4}
                  colorScheme="gray"
                  type="submit"
                  leftIcon={<FiGithub size={18} />}
                  size="lg"
                >
                  Create Github Application
                </Button>
              </form>
            </Box>
          )}

        {data?.setup.canConnectSsh === true &&
          data?.setup.isGithubAppSetup === true &&
          !loggingIn && (
            <Box
              maxWidth="2xl"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {showAppSuccessAlert ? (
                <Alert
                  mt={4}
                  status="success"
                  variant="top-accent"
                  flexDirection="column"
                  alignItems="flex-start"
                  borderBottomRadius="base"
                  boxShadow="md"
                >
                  <AlertTitle mr={2}>
                    Github application successfully created
                  </AlertTitle>
                  <AlertDescription>
                    You can now login to create your first user.
                  </AlertDescription>
                </Alert>
              ) : null}

              <Button
                mt={4}
                colorScheme="gray"
                onClick={handleLogin}
                leftIcon={<FiGithub size={18} />}
                size="lg"
              >
                Log in with Github
              </Button>
            </Box>
          )}
      </Box>
    </Container>
  );
};
