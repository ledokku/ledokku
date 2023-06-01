import { AppByIdQuery, EnvVar } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Divider, Link, Text } from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import {
    EnvVarsDocument,
    useSetEnvVarMutation,
    useUnsetEnvVarMutation
} from '../../../generated/graphql';
import { EnvForm } from '../../../ui/components/EnvForm';
import { AdminLayout } from '../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';
import { useToast } from '../../../ui/toast';

interface EnvProps {
    app: AppByIdQuery['app'];
    envVars: EnvVar[];
}

const Env = ({ app, envVars }: EnvProps) => {
    const toast = useToast();
    const [unsetEnvVarMutation] = useUnsetEnvVarMutation();
    const [setEnvVarMutation] = useSetEnvVarMutation();

    return (
        <AdminLayout pageTitle={`Variables de entorno | ${app?.name}`}>
            {app && <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>}
            <div className="my-6">
                <Text h3>Configurar variables de entorno</Text>
                <Text>
                    Las variables de entorno cambian la manera en la que la aplicación se comporta.
                    Estan disponibles tanto en tiempo de ejecución como en compilación para
                    lanzamientos basados en buildpack.{' '}
                    <Link
                        href="https://dokku.com/docs/configuration/environment-variables/"
                        isExternal
                        css={{ display: 'inline' }}
                    >
                        Leer más
                    </Link>
                </Text>
            </div>

            <div className='flex flex-col'>
                <EnvForm
                    key="newVar"
                    name=""
                    value=""
                    asBuildArg={false}
                    isNewVar={true}
                    onSubmit={
                        async (values) => {
                            try {
                                await setEnvVarMutation({
                                    variables: {
                                        input: {
                                            key: values.name,
                                            value: values.value,
                                            appId: app.id,
                                            asBuildArg: values.asBuildArg
                                        }
                                    },
                                    refetchQueries: [{ query: EnvVarsDocument, variables: { appId: app.id } }],
                                });

                                toast.success('Variable de entorno asignada');
                            } catch (error: any) {
                                toast.error(error.message);
                            }
                        }
                    } />
                {envVars.map((envVar, index) => {
                    return (
                        <>
                            <Divider className='my-4' />
                            <EnvForm
                                key={envVar.key}
                                name={envVar.key}
                                value={envVar.value}
                                asBuildArg={envVar.asBuildArg}
                                onSubmit={
                                    async (values) => {
                                        try {
                                            await setEnvVarMutation({
                                                variables: {
                                                    input: {
                                                        key: values.name,
                                                        value: values.value,
                                                        asBuildArg: values.asBuildArg,
                                                        appId: app.id,
                                                    }
                                                },
                                                refetchQueries: [{ query: EnvVarsDocument, variables: { appId: app.id } }],
                                            });
                                            toast.success('Variable de entorno asignada');
                                        } catch (error: any) {
                                            toast.error(error.message);
                                        }
                                    }
                                }
                                onDelete={async () => {
                                    try {
                                        await unsetEnvVarMutation({
                                            variables: { key: envVar.key, appId: app.id },
                                            refetchQueries: [{ query: EnvVarsDocument, variables: { appId: app.id } }],
                                        });
                                        toast.success('Variable de entorno eliminada');
                                    } catch (error: any) {
                                        toast.error(error.message);
                                    }
                                }}
                            />
                        </>
                    );
                })}

            </div>
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    const res = await serverClient.appById({
        appId: ctx.params?.appId as string
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    });

    const envVarData = await serverClient.envVars({
        appId: ctx.params?.appId as string
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    });


    return {
        props: {
            app: res.app,
            envVars: envVarData.envVars.envVars
        }
    }
}

export default Env;
