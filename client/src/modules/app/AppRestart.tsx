import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useAppByIdQuery,
  useRestartAppMutation,
  useAppRestartLogsSubscription,
  RealTimeLog,
} from '../../generated/graphql';
import {
  Button,
  Modal,
  ModalTitle,
  ModalDescription,
  ModalButton,
  Terminal,
} from '../../ui';

interface AppRestartProps {
  appId: string;
}

export const AppRestart = ({ appId }: AppRestartProps) => {
  const [isRestartAppModalOpen, setIsRestartAppModalOpen] = useState(false);
  const [arrayOfRestartLogs, setArrayOfRestartLogs] = useState<RealTimeLog[]>(
    []
  );
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState<
    'running' | 'notStarted' | 'finished'
  >('notStarted');

  const [restartAppMutation] = useRestartAppMutation();

  const { data, loading /* error */, refetch } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  useAppRestartLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appRestartLogs;
      if (logsExist) {
        setArrayOfRestartLogs((currentLogs) => {
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

  const handleRestartApp = async () => {
    try {
      await restartAppMutation({
        variables: {
          input: {
            appId,
          },
        },
      });
      setIsTerminalVisible(true);
      setRestartLoading(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <>
      <h1 className="text-md font-bold mt-6">Restart app</h1>
      <p className="text-gray-400">
        Restart your dokku app and see logs in real time.
      </p>

      <div className="mt-1">
        <Button
          onClick={() => setIsRestartAppModalOpen(true)}
          color="grey"
          className="mt-2"
        >
          Restart
        </Button>
      </div>
      {isRestartAppModalOpen && (
        <Modal>
          <ModalTitle>Restart app</ModalTitle>
          <ModalDescription>
            {isTerminalVisible ? (
              <>
                <p className="mb-2 ">Restarting {app.name}</p>
                <p className="text-gray-500 mb-2">
                  Restarting the app usually takes couple of minutes. Breathe
                  in, breathe out, logs are about to appear below:
                </p>
                <Terminal className={'w-6/6'}>
                  {arrayOfRestartLogs.map((log) => (
                    <p
                      key={arrayOfRestartLogs.indexOf(log)}
                      className="text-s leading-5"
                    >
                      {log.message}
                    </p>
                  ))}
                </Terminal>
              </>
            ) : (
              <p>{`Are you sure, you want to restart ${app.name} app ?`}</p>
            )}
          </ModalDescription>
          <ModalButton
            ctaFn={() => {
              setProcessStatus('running');
              handleRestartApp();
            }}
            ctaText={'Restart'}
            otherButtonText={'Cancel'}
            isCtaLoading={isTerminalVisible ? false : restartLoading}
            isCtaDisabled={isTerminalVisible}
            isOtherButtonDisabled={processStatus === 'running'}
            closeModal={() => {
              setIsRestartAppModalOpen(false);
              refetch({ appId });
              setRestartLoading(false);
              setIsTerminalVisible(false);
              setProcessStatus('notStarted');
            }}
          />
        </Modal>
      )}
    </>
  );
};
