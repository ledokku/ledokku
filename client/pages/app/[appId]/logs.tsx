import { Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { TerminalOutput } from 'react-terminal-ui';
import { useAppByIdQuery, useAppLogsQuery } from '../../../generated/graphql';
import { Alert } from '../../../ui/components/Alert';
import { Terminal } from '../../../ui/components/Terminal';
import { AdminLayout } from '../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';

const Logs = () => {
    const history = useRouter();
    const appId = history.query.appId as string;

    const { data, loading, error } = useAppByIdQuery({
        variables: {
            appId,
        },
    });

    const { data: appLogsData, loading: appLogsLoading, error: appLogsError } = useAppLogsQuery({
        variables: {
            appId,
        },
    });

    const app = data?.app


    return (
        <AdminLayout loading={loading || appLogsLoading} error={error ?? appLogsError} notFound={!data}>
            {app && <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>}

            <Text h3 className="mt-6">
                Registros de &quot;{app?.name}&quot;:
            </Text>

            {!appLogsLoading && !appLogsError && !appLogsData ? (
                <Alert
                    type="info"
                    message={`No hay registros de "${app?.name}".
            La aplicación no se ha lanzado o se esta lanzando.`}
                />
            ) : null}

            {appLogsData?.appLogs ? (
                <Terminal>
                    {appLogsData.appLogs.logs.map((log, index) => (
                        <TerminalOutput key={index}>{log}</TerminalOutput>
                    ))}
                </Terminal>
            ) : null}
        </AdminLayout>
    );
};

export default Logs;
