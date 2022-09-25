import { useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import {
  Box,
  Text,
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
import { OCStudiosLogo } from '../ui/icons/OCStudiosLogo';
import { Button, Container, Loading } from '@nextui-org/react';
import { Alert } from '../ui/components/Alert';

export const Home = () => {
  const toast = useToast();
  const history = useHistory();
  const { loggedIn, login } = useAuth();
  const { data, loading, error } = useSetupQuery({});
  const [
    registerGithubAppMutation,
    { loading: registerGithubAppLoading },
  ] = useRegisterGithubAppMutation();
  const [
    loginWithGithubMutation,
    { loading: loginWithGithubLoading },
  ] = useLoginWithGithubMutation();
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
        } catch (error: any) {
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
            update: (cache, { data }) => {
              cache.modify({
                fields: {
                  setup: (existingSetup) => {
                    if (data?.registerGithubApp?.githubAppClientId) {
                      // Change the local cache so we don't have to call the server again
                      const newSetup = {
                        ...existingSetup,
                        isGithubAppSetup: true,
                      };
                      return newSetup;
                    }
                    return existingSetup;
                  },
                },
              });
            },
          });
          if (data.data?.registerGithubApp?.githubAppClientId) {
            // Manually set the config so we don't have to reload the page
            config.githubClientId =
              data.data?.registerGithubApp?.githubAppClientId;

            setShowAppSuccessAlert(true);
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    };

    codeToLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
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
    <Container>
      <div
        className='flex flex-col items-center justify-center h-screen'
      >
        <div className='mb-6'>
          <OCStudiosLogo size={150} />
        </div>

        {error && (
          <Text mt={4} color="red.500">
            {error.message}
          </Text>
        )}

        {(loading || registerGithubAppLoading || loginWithGithubLoading) && (
          <Loading className='mt-8' />
        )}

        {data?.setup.canConnectSsh === false && (
          <>
            <Text mt={4}>
              In order to setup the ssh connection, run the following command on
              your Dokku server.
            </Text>
            <Terminal>
              {`echo "${data.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
            </Terminal>
            <Text mt={3}>Once you are done, just refresh this page.</Text>
          </>
        )}

        {data?.setup.canConnectSsh === true &&
          data?.setup.isGithubAppSetup === false &&
          !registerGithubAppLoading && (
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
                  className='mt-4'
                  type="submit"
                  icon={<FiGithub size={18} />}
                  size="lg"
                >
                  Create Github Application
                </Button>
              </form>
            </Box>
          )}

        {data?.setup.canConnectSsh === true &&
          data?.setup.isGithubAppSetup === true &&
          !loginWithGithubLoading && (
            <Box
              maxWidth="2xl"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {showAppSuccessAlert ? (
                <Alert
                  title='Aplicación de Github creada'
                  type='success'
                  message='Ahora puedes iniciar sesión para registrar a tu primer usuario'
                />
              ) : null}

              <Button
                shadow
                className='mt-4'
                onClick={handleLogin}
                icon={<FiGithub size={18} />}
                size="lg"
                color="gradient"
              >
                Log in with Github
              </Button>
            </Box>
          )}
      </div>
    </Container>
  );
};
