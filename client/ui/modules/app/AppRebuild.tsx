import { App } from '@/generated/graphql.server';
import { Button, Loading, Modal, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TerminalOutput } from 'react-terminal-ui';
import {
    LogPayload,
    useAppRebuildLogsSubscription,
    useRebuildAppMutation
} from '../../../generated/graphql';
import { Terminal } from '../../../ui/components/Terminal';
import { useToast } from '../../toast';

interface AppRebuildProps {
    app: App;
}

export const AppRebuild = ({ app }: AppRebuildProps) => {
    const toast = useToast();
    const router = useRouter();
    const [isRebuildAppModalOpen, setIsRebuildAppModalOpen] = useState(false);
    const [arrayOfRebuildLogs, setArrayOfRebuildLogs] = useState<LogPayload[]>([]);
    const [isTerminalVisible, setIsTerminalVisible] = useState(false);
    const [rebuildLoading, setRebuildLoading] = useState(false);
    const [processStatus, setProcessStatus] = useState<'running' | 'notStarted' | 'finished'>(
        'notStarted'
    );

    const [rebuildAppMutation] = useRebuildAppMutation();

    useAppRebuildLogsSubscription({
        onData: (options) => {
            const logsExist = options.data.data?.appRebuildLogs;
            if (logsExist) {
                setArrayOfRebuildLogs((currentLogs) => {
                    return [...currentLogs, logsExist];
                });
                if (logsExist.type === 'end:success' || logsExist.type === 'end:failure') {
                    setProcessStatus('finished');
                }
            }
        },
    });

    const handleRebuildApp = async () => {
        try {
            await rebuildAppMutation({
                variables: {
                    input: {
                        appId: app.id,
                    },
                },
            });
            setIsTerminalVisible(true);
            setRebuildLoading(true);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <>
            <Text h3>Re-compilar</Text>
            <p>Re-compila la aplicación y ve los registros en tiempo real.</p>

            <div className="mt-1">
                <Button onClick={() => setIsRebuildAppModalOpen(true)}>Re-compilar</Button>
            </div>
            <Modal
                preventClose={processStatus === 'running'}
                width={isTerminalVisible ? '90%' : undefined}
                blur
                closeButton
                onClose={() => {
                    setIsRebuildAppModalOpen(false);
                    router.reload();
                    setRebuildLoading(false);
                    setIsTerminalVisible(false);
                    setProcessStatus('notStarted');
                }}
                open={isRebuildAppModalOpen}
            >
                <Modal.Header>
                    <Text h4>Re-compilar</Text>
                </Modal.Header>
                <Modal.Body>
                    {isTerminalVisible ? (
                        <>
                            <p className="mb-2 ">Re-compilando {app.name}</p>
                            <p className="text-gray-500 mb-2">
                                Re-compilar la app toma algunos minutos. Respira un poco, los
                                registros aparecerán pronto:
                            </p>
                            <Terminal className={'w-6/6'}>
                                {arrayOfRebuildLogs.map((log, index) => (
                                    <TerminalOutput key={index}>{log.message}</TerminalOutput>
                                ))}
                            </Terminal>
                        </>
                    ) : (
                        <p>
                            ¿Estás seguro de re-compilar la aplicación <b>{app.name}</b>?
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        size="sm"
                        disabled={processStatus === 'running'}
                        bordered
                        onClick={() => {
                            setIsRebuildAppModalOpen(false);
                            router.reload();
                            setRebuildLoading(false);
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
                            handleRebuildApp();
                        }}
                    >
                        {(isTerminalVisible ? false : rebuildLoading) ? (
                            <Loading size="sm" color="currentColor" type='points-opacity' />
                        ) : (
                            'Compilar'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
