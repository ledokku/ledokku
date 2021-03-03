import { useState } from 'react';
import {
  useAppProxyPortsQuery,
  useRemoveAppProxyPortMutation,
  AppProxyPort,
} from '../../generated/graphql';
import {
  Button,
  Modal,
  ModalTitle,
  ModalButton,
  ModalDescription,
} from '../../ui';
import { AddAppProxyPorts } from './AddAppProxyPorts';
import { useToast } from '@chakra-ui/react';
import { toastConfig } from '../../pages/utils';

interface AppProxyPortsProps {
  appId: string;
}

export const AppProxyPorts = ({ appId }: AppProxyPortsProps) => {
  const toast = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [processStatus, setProcessStatus] = useState<
    'running' | 'notStarted' | 'finished'
  >('notStarted');
  const {
    data: appProxyPortsData,
    loading: appProxyPortsLoading,
    // TODO display error
    // error: appProxyPortsError,
    refetch: appProxyPortsRefetch,
  } = useAppProxyPortsQuery({
    variables: { appId },
  });
  const [
    removeAppProxyPortMutation,
    { loading: removeAppPortLoading },
  ] = useRemoveAppProxyPortMutation();

  const handleRemovePort = async (proxyPort: AppProxyPort) => {
    try {
      await removeAppProxyPortMutation({
        variables: {
          input: {
            appId,
            scheme: proxyPort.scheme,
            host: proxyPort.host,
            container: proxyPort.container,
          },
        },
      });
      setIsDeleteModalOpen(false);
      toast({
        description: 'Port mapping deleted successfully',
        ...toastConfig('success'),
      });
      await appProxyPortsRefetch();
    } catch (error) {
      toast({
        description: error.message,
        ...toastConfig('error'),
      });
    }
  };

  return (
    <>
      <div className="py-5">
        <h1 className="text-md font-bold">Port Management</h1>
        <p className="text-gray-400 text-sm">
          The following ports are assigned to your app.
        </p>
      </div>

      {appProxyPortsLoading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : null}

      {appProxyPortsData && appProxyPortsData.appProxyPorts.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase">
                Scheme
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase">
                Host port
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase">
                Container port
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appProxyPortsData.appProxyPorts.map((proxyPort, index) => (
              <>
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {proxyPort.scheme}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {proxyPort.host}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {proxyPort.container}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {isDeleteModalOpen && (
                  <Modal>
                    <ModalTitle>Delete port</ModalTitle>
                    <ModalDescription>
                      <p>Are you sure, you want to delete this port mapping?</p>
                    </ModalDescription>
                    <ModalButton
                      ctaFn={() => {
                        setProcessStatus('running');
                        handleRemovePort(proxyPort);
                      }}
                      ctaText={'Delete'}
                      otherButtonText={'Cancel'}
                      isCtaLoading={
                        removeAppPortLoading || processStatus === 'running'
                      }
                      isCtaDisabled={
                        removeAppPortLoading || processStatus === 'running'
                      }
                      isOtherButtonDisabled={removeAppPortLoading}
                      closeModal={() => {
                        setIsDeleteModalOpen(false);
                        setProcessStatus('notStarted');
                      }}
                    />
                  </Modal>
                )}
              </>
            ))}
          </tbody>
        </table>
      ) : null}

      <Button
        color="grey"
        variant="outline"
        className="text-sm mt-3"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add port mapping
      </Button>

      <AddAppProxyPorts
        appId={appId}
        appProxyPortsRefetch={appProxyPortsRefetch}
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};
