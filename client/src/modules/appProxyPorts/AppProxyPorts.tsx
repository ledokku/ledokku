import { useState } from 'react';
import {
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
import { Button, Grid, Loading, Table, Text } from '@nextui-org/react';

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
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Grid.Container gap={2}>
      <Grid xs={12} className='flex flex-col'>
        <Text h2>
          Configuración de puertos
        </Text>
        <Text>
          Los siguientes puertos están asignados a tu aplicación.
        </Text>

        {appProxyPortsLoading ? (
          <Loading />
        ) : null}
      </Grid>



      <Grid xs={12} className='flex flex-col'>
        {appProxyPortsData && appProxyPortsData.appProxyPorts.length > 0 ? (
          <Table className='w-full'>
            <Table.Header>
              <Table.Column>Scheme</Table.Column>
              <Table.Column>Host port</Table.Column>
              <Table.Column>Container port</Table.Column>
              <Table.Column>Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {appProxyPortsData.appProxyPorts.map((proxyPort, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{proxyPort.scheme}</Table.Cell>
                  <Table.Cell>{proxyPort.host}</Table.Cell>
                  <Table.Cell>{proxyPort.container}</Table.Cell>
                  <Table.Cell>
                    <Button
                      css={{ minWidth: 0 }}
                      color="error"
                      flat
                      size="sm"
                      onClick={() => setIsDeleteModalOpen(proxyPort)}
                    >
                      Eliminar
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : null}
        <div className='mt-8 flex justify-end'>
          <Button
            bordered
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            Añadir mapeo de puertos
          </Button>
        </div>

        <AddAppProxyPorts
          appId={appId}
          appProxyPortsRefetch={appProxyPortsRefetch}
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Grid>

      <Modal isOpen={!!isDeleteModalOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete port</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure, you want to delete this port mapping?
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              color="error"
              // isLoading={appProxyPortsLoading || removeAppPortLoading}
              onClick={handleRemovePort}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </Grid.Container >
  );
};
