import { Divider, Link, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import {
    EnvVarsDocument,
    useAppByIdQuery,
    useEnvVarsQuery,
    useSetEnvVarMutation,
    useUnsetEnvVarMutation
} from '../../../generated/graphql';
import { EnvForm } from '../../../ui/components/EnvForm';
import { AdminLayout } from '../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';
import { useToast } from '../../../ui/toast';


const Env = () => {
    const history = useRouter();
    const appId = history.query.appId as string;
    const { data, loading, error } = useAppByIdQuery({
        variables: {
            appId,
        },
        ssr: false,
        skip: !appId,
    });
    const toast = useToast();
    const [unsetEnvVarMutation, { loading: unsetEnvVarLoading }] = useUnsetEnvVarMutation();
    const [setEnvVarMutation, { loading: setEnvVarLoading }] = useSetEnvVarMutation();

    const { data: envVarData, loading: envVarLoading, error: envVarError } = useEnvVarsQuery({
        variables: {
            appId,
        },
        fetchPolicy: 'network-only',
    });

    const app = data?.app

    return (
        <AdminLayout loading={loading || envVarLoading} error={error ?? envVarError}>
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

            {envVarData?.envVars.envVars && (
                <div>
                    {envVarData.envVars.envVars.map((envVar, index) => {
                        return (
                            <div key={index}>
                                <EnvForm
                                    key={envVar.key}
                                    name={envVar.key}
                                    value={envVar.value}
                                    onSubmit={
                                        async (values) => {
                                            try {
                                                await setEnvVarMutation({
                                                    variables: { key: values.name, value: values.value, appId },
                                                    refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
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
                                                variables: { key: envVar.key, appId },
                                                refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
                                            });
                                            toast.success('Variable de entorno eliminada');
                                        } catch (error: any) {
                                            toast.error(error.message);
                                        }
                                    }}
                                />
                                <div className="my-8">
                                    <Divider />
                                </div>
                            </div>
                        );
                    })}
                    <EnvForm
                        key="newVar"
                        name=""
                        value=""
                        isNewVar={true} onSubmit={
                            async (values) => {
                                try {
                                    await setEnvVarMutation({
                                        variables: { key: values.name, value: values.value, appId },
                                        refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
                                    });

                                    toast.success('Variable de entorno asignada');
                                } catch (error: any) {
                                    toast.error(error.message);
                                }
                            }
                        } />
                </div>
            )}
        </AdminLayout>
    );
};

export default Env;
