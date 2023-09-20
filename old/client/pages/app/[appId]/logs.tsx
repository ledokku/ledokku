import { AppByIdQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Text } from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { TerminalOutput } from 'react-terminal-ui';
import { useAppLogsQuery } from '../../../generated/graphql';
import { Alert } from '../../../ui/components/Alert';
import { Terminal } from '../../../ui/components/Terminal';
import { AdminLayout } from '../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';

interface LogsProps {
    app: AppByIdQuery['app'];
}

const Logs = ({ app }: LogsProps) => {
    const { data, loading, error, startPolling } = useAppLogsQuery({
        variables: {
            appId: app.id,
        },
    });

    useEffect(() => {
        startPolling(1000);
    }, [startPolling]);

    return (
        <AdminLayout pageTitle={`Registros | ${app?.name}`}>
            {app && <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>}

            <Text h3 className="my-6">
                Registros de &quot;{app?.name}&quot;:
            </Text>

            {!loading && !error && !data ? (
                <Alert
                    type="info"
                    message={`No hay registros de "${app?.name}".
            La aplicación no se ha lanzado o se esta lanzando.`}
                />
            ) : null}

            {data?.appLogs ? (
                <Terminal>
                    {data.appLogs.logs.map((log, index) => (
                        <TerminalOutput key={index}>{log}</TerminalOutput>
                    ))}
                </Terminal>
            ) : null}
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


    return {
        props: {
            app: res.app
        }
    }
}

export default Logs;
