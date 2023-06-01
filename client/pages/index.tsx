import { SetupQuery } from '@/generated/graphql.server';
import { Button, Container, Text } from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiGithub } from 'react-icons/fi';
import { serverClient } from '../lib/apollo.server';
import { CodeBox } from '../ui/components/CodeBox';
import { OCStudiosLogo } from '../ui/icons/OCStudiosLogo';

interface IndexProps {
    setup: SetupQuery['setup'];
}

const Index = ({ setup }: IndexProps) => {
    const router = useRouter();

    const loginError = router.query.error as string | undefined;

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

                {loginError && <Text className="mt-4 text-red-500 text-center">{loginError}</Text>}

                {setup?.canConnectSsh === false && (
                    <div className="w-156 flex flex-col justify-center">
                        <Text className="mt-4">
                            Para conectarse por SSH, ejecuta el siguiente comando en tu servidor de
                            Dokku.
                        </Text>
                        <CodeBox lang="bash">
                            {`echo "${setup.sshPublicKey}" | dokku ssh-keys:add ledokku`}
                        </CodeBox>
                        <Text className="mt-3">Una vez finalizado, refresca la página.</Text>
                    </div>
                )}

                {setup?.canConnectSsh &&
                    setup.isGithubAppSetup &&
                    <div className="flex flex-col justify-center items-center">
                        <Button
                            shadow
                            className="mt-4"
                            onClick={() => signIn('github')}
                            icon={<FiGithub size={18} />}
                            iconLeftCss={{ display: 'contents', marginRight: '8px' }}
                            size="lg"
                            color="gradient"
                        >
                            &nbsp; Iniciar sesión con Github
                        </Button>
                    </div>}
            </div>
        </Container>
    );
};


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { setup } = await serverClient.setup();
    const session = await getSession({ ctx });

    if (session) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: true,
            }
        }
    }

    return {
        props: {
            setup,
        }
    }
}


export default Index;