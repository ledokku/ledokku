import { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import {
  useAppProxyPortsQuery,
  useRemoveAppProxyPortMutation,
  AppProxyPort,
} from '../../generated/graphql';
import { AddAppProxyPorts } from './AddAppProxyPorts';
import { useToast } from '../../ui/toast';

interface AppProxyPortsProps {
  appId: string;
}

export const AppProxyPorts = ({ appId }: AppProxyPortsProps) => {
  const toast = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<
    false | AppProxyPort
  >(false);
  const {
    data: appProxyPortsData,
    loading: appProxyPortsLoading,
    // TODO display error
    // error: appProxyPortsError,
    refetch: appProxyPortsRefetch,
  } = useAppProxyPortsQuery({
    variables: { appId },
    notifyOnNetworkStatusChange: true,
  });
  const [
    removeAppProxyPortMutation,
    { loading: removeAppPortLoading },
  ] = useRemoveAppProxyPortMutation();

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleRemovePort = async () => {
    const proxyPort = isDeleteModalOpen;
    if (!proxyPort) return;

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
      await appProxyPortsRefetch();
      setIsDeleteModalOpen(false);
      toast.success('Port mapping deleted successfully');

      await appProxyPortsRefetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Box py="5">
        <Text fontSize="md" fontWeight="bold">
          Port Management
        </Text>
        <Text fontSize="sm" color="gray.400">
          The following ports are assigned to your app.
        </Text>
      </Box>

      {appProxyPortsLoading ? (
        <Text fontSize="sm" color="gray.400">
          Loading...
        </Text>
      ) : null}

      {appProxyPortsData && appProxyPortsData.appProxyPorts.length > 0 ? (
        <Table>
          <Thead>
            <Tr>
              <Th>Scheme</Th>
              <Th isNumeric>Host port</Th>
              <Th isNumeric>Container port</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {appProxyPortsData.appProxyPorts.map((proxyPort, index) => (
              <Tr key={index}>
                <Td>{proxyPort.scheme}</Td>
                <Td isNumeric>{proxyPort.host}</Td>
                <Td isNumeric>{proxyPort.container}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    variant="link"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(proxyPort)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : null}

      <Modal isOpen={!!isDeleteModalOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete port</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure, you want to delete this port mapping?
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              isLoading={appProxyPortsLoading || removeAppPortLoading}
              onClick={handleRemovePort}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button
        mt="3"
        variant="outline"
        size="sm"
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
