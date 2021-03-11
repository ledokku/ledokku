import { useState } from 'react';
import {
  useAppByIdQuery,
  useRebuildAppMutation,
  useAppRebuildLogsSubscription,
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
      <h1 className="text-md font-bold mt-6">Rebuild app</h1>
      <p className="text-gray-400">
        Rebuild your dokku app and see logs in real time.
      </p>

      <div className="mt-1">
        <Button
          onClick={() => setIsRebuildAppModalOpen(true)}
          color="grey"
          className="mt-2"
        >
          Rebuild
        </Button>
      </div>
      {isRebuildAppModalOpen && (
        <Modal>
          <ModalTitle>Rebuild app</ModalTitle>
          <ModalDescription>
            {isTerminalVisible ? (
              <>
                <p className="mb-2 ">Rebuilding {app.name}</p>
                <p className="text-gray-500 mb-2">
                  Rebuilding the app usually takes couple of minutes. Breathe
                  in, breathe out, logs are about to appear below:
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
              <p>{`Are you sure, you want to rebuild ${app.name} app ?`}</p>
            )}
          </ModalDescription>
          <ModalButton
            ctaFn={() => {
              setProcessStatus('running');
              handleRebuildApp();
            }}
            ctaText={'Rebuild'}
            otherButtonText={'Cancel'}
            isCtaLoading={isTerminalVisible ? false : rebuildLoading}
            isCtaDisabled={isTerminalVisible}
            isOtherButtonDisabled={processStatus === 'running'}
            closeModal={() => {
              setIsRebuildAppModalOpen(false);
              refetch({ appId });
              setRebuildLoading(false);
              setIsTerminalVisible(false);
              setProcessStatus('notStarted');
            }}
          />
        </Modal>
      )}
    </>
  );
};
