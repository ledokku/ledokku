import { Text } from '@nextui-org/react';
import { TerminalOutput } from 'react-terminal-ui';
import { useLedokkuLogsQuery, useOnLedokkuLogsSubscription } from '../generated/graphql';
import { Terminal } from '../ui/components/Terminal';
import { AdminLayout } from '../ui/layout/layout';

const Metrics = () => {
    const { data } = useLedokkuLogsQuery();

    useOnLedokkuLogsSubscription({
        onSubscriptionData(options) {
            data?.ledokkuLogs.push(options.subscriptionData.data?.onLedokkuLog)
        },
    });

    return (
        <AdminLayout>
            <Text h2 className="mb-8">
                Métricas
            </Text>
            <Text h3>Registros de Ledokku</Text>
            <Terminal>
                {data?.ledokkuLogs.map((it, index) => <TerminalOutput key={index}>
                    {it}
                </TerminalOutput>)}
            </Terminal>
        </AdminLayout>
    );
};

export default Metrics;
