import { Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { TerminalOutput } from 'react-terminal-ui';
import { LogPayload, useLedokkuLogsQuery, useOnLedokkuLogsSubscription } from '../generated/graphql';
import { Terminal } from '../ui/components/Terminal';
import { AdminLayout } from '../ui/layout/layout';

const Metrics = () => {
    const [data, setData] = useState<LogPayload[]>([]);
    const { data: logs, loading: loadingLogs, error } = useLedokkuLogsQuery();

    useEffect(() => {
        if (logs && logs.ledokkuLogs.length > 0) {
            setData(logs.ledokkuLogs);
        }
    }, [logs])

    useOnLedokkuLogsSubscription({
        onSubscriptionData(options) {
            const sub = options.subscriptionData.data?.onLedokkuLog;
            if (sub) {
                setData([...data, sub])
            }
        },
    });


    return (
        <AdminLayout error={error} pageTitle="Métricas">
            <Text h2 className="mb-8">
                Métricas
            </Text>
            <Text h3>Registros de Ledokku</Text>
            <Terminal loading={loadingLogs}>
                {data.map((it, index) => <TerminalOutput key={index}>
                    {it.message}
                </TerminalOutput>)}
            </Terminal>
        </AdminLayout>
    );
};

export default Metrics;
