import {
  Box,
  Text
} from '@chakra-ui/react';
import { Button, Container, Loading } from '@nextui-org/react';
import { useEffect } from 'react';
import { FiGithub } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import { config } from '../config';
import {
  useLoginWithGithubMutation, useSetupQuery
} from '../generated/graphql';
import { useAuth } from '../modules/auth/AuthContext';
import { CodeBox } from '../ui/components/CodeBox';
import { OCStudiosLogo } from '../ui/icons/OCStudiosLogo';
import { useToast } from '../ui/toast';

export const Home = () => {
  const toast = useToast();
  const history = useHistory();
  const { loggedIn, login } = useAuth();
  const { data, loading, error } = useSetupQuery({});
  const [
    loginWithGithubMutation,
    { loading: loginWithGithubLoading },
  ] = useLoginWithGithubMutation();

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

        {(loading || loginWithGithubLoading) && (
          <Loading className='mt-8' />
        )}

        {data?.setup.canConnectSsh === false && (
          <div className='w-156 flex flex-col justify-center'>
            <Text mt={4}>
              Para conectarse por SSH, ejecuta el siguiente comando en tu servidor de Dokku.
            </Text>
            <CodeBox lang='bash'>
              {`echo "${data.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
            </CodeBox>
            <Text mt={3}>Una vez finalizado, refresca la página.</Text>
          </div>
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

              <Button
                shadow
                className='mt-4'
                onClick={handleLogin}
                icon={<FiGithub size={18} />}
                iconLeftCss={{ display: "contents", marginRight: "8px" }}
                size="lg"
                color="gradient"
              >
                &nbsp; Iniciar sesión con Github
              </Button>
            </Box>
          )}
      </div>
    </Container>
  );
};
