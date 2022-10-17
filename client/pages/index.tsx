import { Button, Container, Loading, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FiGithub } from 'react-icons/fi';
import { GITHUB_APP_CLIENT_ID } from '../constants';
import {
  useLoginWithGithubMutation,
  useSetupQuery,
} from '../generated/graphql';
import { CodeBox } from '../ui/components/CodeBox';
import { OCStudiosLogo } from '../ui/icons/OCStudiosLogo';
import { useAuth } from '../ui/modules/auth/AuthContext';
import { useToast } from '../ui/toast';

const Index = () => {
  const toast = useToast();
  const history = useRouter();
  const { loggedIn, login } = useAuth();
  const { data, loading, error } = useSetupQuery();
  const [
    loginWithGithubMutation,
    { loading: loginWithGithubLoading },
  ] = useLoginWithGithubMutation();

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
  }, []);

  const handleLogin = () => {
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_APP_CLIENT_ID}&state=github_login`
    );
  };

  if (loggedIn) {
    history.replace('/dashboard');
  }

  return (
    <Container className="h-screen">
      <div
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '700px',
        }}
        className="flex flex-col justify-center relative"
      >
        <div className="mb-6 mx-auto">
          <OCStudiosLogo size={150} />
        </div>

        {error && <Text className="mt-4 text-red-500">{error.message}</Text>}

        {(loading || loginWithGithubLoading) && <Loading className="mt-8" />}

        {data?.setup.canConnectSsh === false && (
          <div className="w-156 flex flex-col justify-center">
            <Text className="mt-4">
              Para conectarse por SSH, ejecuta el siguiente comando en tu
              servidor de Dokku.
            </Text>
            <CodeBox lang="bash">
              {`echo "${data.setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
            </CodeBox>
            <Text className="mt-3">
              Una vez finalizado, refresca la página.
            </Text>
          </div>
        )}

        {data?.setup.canConnectSsh === true &&
          data?.setup.isGithubAppSetup === true &&
          !loginWithGithubLoading && (
            <div className="flex flex-col justify-center items-center">
              <Button
                shadow
                className="mt-4"
                onClick={handleLogin}
                icon={<FiGithub size={18} />}
                iconLeftCss={{ display: 'contents', marginRight: '8px' }}
                size="lg"
                color="gradient"
              >
                &nbsp; Iniciar sesión con Github
              </Button>
            </div>
          )}
      </div>
    </Container>
  );
};

export default Index;
