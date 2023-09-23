"use client";

import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AppProxyPortsDocument,
  ProxyPort,
  useAppProxyPortsQuery,
  useRemoveAppProxyPortMutation,
} from "@/generated/graphql";
import { Alert } from "@/ui/components/alerts/Alert";
import { useAppContext } from "@/contexts/AppContext";
import toast from "react-hot-toast";
import { AddAppProxyPortsModal } from "@/ui/components/modals/AddAppProxyPortsModal";
import { FiPlus } from "react-icons/fi";

export default function AppProxyPorts() {
  const app = useAppContext();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<false | ProxyPort>(
    false
  );
  const { data, loading } = useAppProxyPortsQuery({
    variables: {
      appId: app.id,
    },
  });

  const [removeAppProxyPortMutation, { loading: removeAppPortLoading }] =
    useRemoveAppProxyPortMutation();

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
            appId: app.id,
            scheme: proxyPort.scheme,
            host: proxyPort.host,
            container: proxyPort.container,
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [AppProxyPortsDocument],
      });
      setIsDeleteModalOpen(false);
      toast.success("Puerto eliminado");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h3>Configuración de puertos</h3>

          <Button
            startContent={<FiPlus />}
            color="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            Añadir mapeo de puertos
          </Button>
        </div>
        <p>Los siguientes puertos están asignados a tu aplicación.</p>
      </div>

      <div className="flex flex-col mt-4">
        <Table className="w-full">
          <TableHeader>
            <TableColumn>Esquema</TableColumn>
            <TableColumn>Puerto anfitrion</TableColumn>
            <TableColumn>Puerto contenedor</TableColumn>
            <TableColumn width={100}>Acciones</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<Spinner />}
            emptyContent="No hay mapeo de puertos asignado"
          >
            {data?.appProxyPorts.map((proxyPort, index) => (
              <TableRow key={index}>
                <TableCell>{proxyPort.scheme}</TableCell>
                <TableCell>{proxyPort.host}</TableCell>
                <TableCell>{proxyPort.container}</TableCell>
                <TableCell>
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(proxyPort)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            )) ?? []}
          </TableBody>
        </Table>

        <AddAppProxyPortsModal
          appId={app.id}
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>

      <Modal
        isOpen={!!isDeleteModalOpen}
        onClose={handleCloseModal}
        backdrop="blur"
        closeButton
      >
        <ModalContent>
          <ModalHeader>
            <h4>Eliminar mapeo de puertos</h4>
          </ModalHeader>
          <ModalBody>
            ¿Estas seguro de eliminar este mapeo de puertos?
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal} size="sm" variant="bordered">
              Cancelar
            </Button>
            <Button
              size="sm"
              color="danger"
              onClick={handleRemovePort}
              isLoading={removeAppPortLoading}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
