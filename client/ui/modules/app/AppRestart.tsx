import { Button, Loading, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { TerminalOutput } from 'react-terminal-ui';

import { App } from '@/generated/graphql.server';
import { useRouter } from 'next/router';
import {
    LogPayload,
    useAppRestartLogsSubscription,
    useRestartAppMutation
} from '../../../generated/graphql';
import { Terminal } from '../../../ui/components/Terminal';
import { useToast } from '../../toast';

interface AppRestartProps {
    app: App;
}

export const AppRestart = ({ app }: AppRestartProps) => {
    const toast = useToast();
    const router = useRouter();
    const [isRestartAppModalOpen, setIsRestartAppModalOpen] = useState(false);
    const [arrayOfRestartLogs, setArrayOfRestartLogs] = useState<LogPayload[]>([]);
    const [isTerminalVisible, setIsTerminalVisible] = useState(false);
    const [restartLoading, setRestartLoading] = useState(false);
    const [processStatus, setProcessStatus] = useState<'running' | 'notStarted' | 'finished'>(
        'notStarted'
    );

    const [restartAppMutation] = useRestartAppMutation();

    useAppRestartLogsSubscription({
        onSubscriptionData: (data) => {
            const logsExist = data.subscriptionData.data?.appRestartLogs;
            if (logsExist) {
                setArrayOfRestartLogs((currentLogs) => {
                    return [...currentLogs, logsExist];
                });
                if (logsExist.type === 'end:success' || logsExist.type === 'end:failure') {
                    setProcessStatus('finished');
                }
            }
        },
    });

    const handleRestartApp = async () => {
        try {
            await restartAppMutation({
                variables: {
                    input: {
                        appId: app.id,
                    },
                },
            });
            setIsTerminalVisible(true);
            setRestartLoading(true);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <>
            <Text h3>Reiniciar aplicación</Text>
            <Text>Reinicia tu aplicación y ve los registros en tiempo real.</Text>

            <div className="mt-1">
                <Button onClick={() => setIsRestartAppModalOpen(true)} className="mt-2">
                    Reiniciar
                </Button>
            </div>
            <Modal
                preventClose={processStatus === 'running'}
                width={isTerminalVisible ? '90%' : undefined}
                blur
                onClose={() => {
                    setIsRestartAppModalOpen(false);

                    setRestartLoading(false);
                    setIsTerminalVisible(false);
                    setProcessStatus('notStarted');
                }}
                open={isRestartAppModalOpen}
            >
                <Modal.Header>
                    <Text h4>Reinciar aplicación</Text>
                </Modal.Header>
                <Modal.Body>
                    {isTerminalVisible ? (
                        <>
                            <p className="mb-2">
                                Reiniciando <b>{app.name}</b>
                            </p>
                            <p className="text-gray-500 mb-2">
                                Reiniciar la app toma algunos minutos. Respira un poco, los
                                registros aparecerán pronto:
                            </p>
                            <Terminal className={'w-6/6'}>
                                {arrayOfRestartLogs.map((log) => (
                                    <TerminalOutput key={arrayOfRestartLogs.indexOf(log)}>
                                        {log.message}
                                    </TerminalOutput>
                                ))}
                            </Terminal>
                        </>
                    ) : (
                        <Text>
                            ¿Estás seguro de que deseas reiniciar <b>{app.name}</b>?
                        </Text>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        size="sm"
                        disabled={processStatus === 'running'}
                        bordered
                        onClick={() => {
                            setIsRestartAppModalOpen(false);
                            router.reload();
                            setRestartLoading(false);
                            setIsTerminalVisible(false);
                            setProcessStatus('notStarted');
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={isTerminalVisible}
                        size="sm"
                        color="warning"
                        onClick={() => {
                            setProcessStatus('running');
                            handleRestartApp();
                        }}
                    >
                        {(isTerminalVisible ? false : restartLoading) ? (
                            <Loading size="sm" color="currentColor" type='points-opacity' />
                        ) : (
                            'Reiniciar'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
