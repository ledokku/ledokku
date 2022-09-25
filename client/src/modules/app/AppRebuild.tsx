import { Button, Loading, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import {
  useAppByIdQuery,
  useRebuildAppMutation,
  useAppRebuildLogsSubscription,
  RealTimeLog,
} from '../../generated/graphql';
import {
  Terminal,
} from '../../ui';
import { useToast } from '../../ui/toast';

interface AppRebuildProps {
  appId: string;
}

export const AppRebuild = ({ appId }: AppRebuildProps) => {
  const toast = useToast();
  const [isRebuildAppModalOpen, setIsRebuildAppModalOpen] = useState(false);
  const [arrayOfRebuildLogs, setArrayOfRebuildLogs] = useState<RealTimeLog[]>(
    []
  );
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [rebuildLoading, setRebuildLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState<
    'running' | 'notStarted' | 'finished'
  >('notStarted');

  const [rebuildAppMutation] = useRebuildAppMutation();

  const { data, loading /* error */, refetch } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  useAppRebuildLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appRebuildLogs;
      if (logsExist) {
        setArrayOfRebuildLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (
          logsExist.type === 'end:success' ||
          logsExist.type === 'end:failure'
        ) {
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
            appId,
          },
        },
      });
      setIsTerminalVisible(true);
      setRebuildLoading(true);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <Loading />;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <>
      <Text h3>Re-compilar</Text>
      <p>
        Re-compila la aplicación y ve los registros en tiempo real.
      </p>

      <div className="mt-1">
        <Button
          onClick={() => setIsRebuildAppModalOpen(true)}
        >
          Re-compilar
        </Button>
      </div>
      <Modal preventClose={processStatus === 'running'} width={processStatus === 'running' ? "90%" : undefined} blur closeButton onClose={() => {
        setIsRebuildAppModalOpen(false);
        refetch({ appId });
        setRebuildLoading(false);
        setIsTerminalVisible(false);
        setProcessStatus('notStarted');
      }} open={isRebuildAppModalOpen}>
        <Modal.Header><Text h4>Re-compilar</Text></Modal.Header>
        <Modal.Body>
          {isTerminalVisible ? (
            <>
              <p className="mb-2 ">Re-compilando {app.name}</p>
              <p className="text-gray-500 mb-2">
                Re-compilar la app toma algunos minutos. Respira un poco, los registros aparecerán pronto:
              </p>
              <Terminal className={'w-6/6'}>
                {arrayOfRebuildLogs.map((log) => (
                  <p
                    key={arrayOfRebuildLogs.indexOf(log)}
                    className="text-s leading-5"
                  >
                    {log.message}
                  </p>
                ))}
              </Terminal>
            </>
          ) : (
            <p>¿Estás seguro de re-compilar la aplicación <b>{app.name}</b>?</p>
          )}
        </Modal.Body>
        <Modal.Footer
        >
          <Button size="sm"
            disabled={processStatus === 'running'}
            bordered onClick={() => {
              setIsRebuildAppModalOpen(false);
              refetch({ appId });
              setRebuildLoading(false);
              setIsTerminalVisible(false);
              setProcessStatus('notStarted');
            }}>
            Cancelar
          </Button>
          <Button
            disabled={isTerminalVisible}
            size="sm"
            color="warning" onClick={() => {
              setProcessStatus('running');
              handleRebuildApp();
            }}>
            {(isTerminalVisible ? false : rebuildLoading) ? <Loading size='sm' color="currentColor" /> : "Compilar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
