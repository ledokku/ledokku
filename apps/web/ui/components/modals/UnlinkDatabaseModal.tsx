"use client";

import {
  AppByIdQuery,
  DatabaseQuery,
  LogPayload,
  useLinkDatabaseLogsSubscription,
  useLinkDatabaseMutation,
  useUnlinkDatabaseLogsSubscription,
  useUnlinkDatabaseMutation,
} from "@/generated/graphql";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Terminal } from "../Terminal";
import toast from "react-hot-toast";

interface LinkDatabaseModalProps {
  isOpen: boolean;
  app?: AppByIdQuery["app"];
  database?: AppByIdQuery["app"]["databases"][0];
  onOpenChange: (open: boolean) => void;
}

export const UnlinkDatabaseModal = ({
  app,
  database,
  onOpenChange,
  isOpen,
}: LinkDatabaseModalProps) => {
  const [unlinkLogHistory, setUnlinkLogHistory] = useState<LogPayload[]>([]);

  const [unlinkDatabaseMutation, { loading: loadingUnlink }] =
    useUnlinkDatabaseMutation();

  useUnlinkDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.unlinkDatabaseLogs;
      if (logsExist) {
        setUnlinkLogHistory((currentLogs) => {
          return [...currentLogs, logsExist];
        });

        switch (logsExist.type) {
          case "end:success":
            toast.success("Desenlace exitoso");
            break;
          case "end:failure":
            toast.error("Desenlace fallido");
            break;
        }
      }
    },
  });

  useEffect(() => {
    setUnlinkLogHistory([]);
  }, [app, database, isOpen]);

  const handleUnlink = async (databaseId: string, appId: string) => {
    try {
      await unlinkDatabaseMutation({
        variables: {
          input: {
            databaseId,
            appId,
          },
        },
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const isTerminalVisible = unlinkLogHistory.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      closeButton
      onOpenChange={onOpenChange}
      size={isTerminalVisible ? "5xl" : "md"}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h4>Desenlazar base de datos</h4>
        </ModalHeader>
        <ModalBody>
          {isTerminalVisible ? (
            <>
              <p className="mb-2 ">
                ¡Desenlazando <b>{app?.name}</b> de <b>{database?.name}</b>!
              </p>
              <p className="mb-2 text-gray-500">
                El proceso de desenlace usualmente tarda unos minutos. Respira
                un poco, los registros apareceran pronto:
              </p>
              <Terminal
                scrollOnNew
                className="w-6/6"
                logs={unlinkLogHistory.map((it) => it.message)}
              />
            </>
          ) : (
            <p>
              ¿Estás seguro de desenlazar <b>{app?.name}</b> de{" "}
              <b>{database?.name}</b>?
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {isTerminalVisible ? "Cerrar" : "Cancelar"}
          </Button>
          {!isTerminalVisible && (
            <Button
              size="sm"
              type="submit"
              color="primary"
              onClick={() => {
                handleUnlink(database?.id!, app?.id!);
              }}
              disabled={isTerminalVisible}
              isLoading={loadingUnlink}
            >
              Desenlazar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
