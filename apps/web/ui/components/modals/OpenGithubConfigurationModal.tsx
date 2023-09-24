"use client";

import { useOpenGithubConfig } from "@/hooks/useOpenGithubConfig";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface OpenGithubConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenGithubConfigurationModal({
  isOpen,
  onClose,
}: OpenGithubConfigurationModalProps) {
  const router = useRouter();
  const { openGithubConfig } = useOpenGithubConfig({
    onClosed() {
      router.refresh();
    },
  });

  return (
    <Modal backdrop="blur" closeButton isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h4>Configuración de Github</h4>
        </ModalHeader>
        <ModalBody>
          Una nueva ventana se abrirá. Después de que hayas finalizado de
          seleccionar los repositorios, cierra esa ventana para refrescar.
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-row">
            <Button size={"sm"} className="mr-3" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                openGithubConfig();
                onClose();
              }}
            >
              Entendido
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
