"use client";

import { useOpenGithubConfig } from "@/hooks/useOpenGithubConfig";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface OpenGithubConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenGithubConfigurationModal({
  isOpen,
  onClose,
}: OpenGithubConfigurationModalProps) {
  const { openGithubConfig } = useOpenGithubConfig();

  return (
    <Modal backdrop="blur" closeButton isOpen={isOpen} onClose={onClose}>
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
            size={"sm"}
            onClick={() => {
              openGithubConfig();
              onClose();
            }}
          >
            Entendido
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
