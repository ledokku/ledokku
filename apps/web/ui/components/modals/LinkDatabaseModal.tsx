"use client";

import {
  AppByIdQuery,
  AppsQuery,
  DatabaseByIdQuery,
  DatabaseQuery,
  LogPayload,
  useLinkDatabaseLogsSubscription,
  useLinkDatabaseMutation,
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
import { Terminal } from "../misc/Terminal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface LinkDatabaseModalProps {
  isOpen: boolean;
  app?: AppsQuery["apps"]["items"][0] | AppByIdQuery["app"];
  database?:
    | DatabaseQuery["databases"]["items"][0]
    | DatabaseByIdQuery["database"];
  onOpenChange: (open: boolean) => void;
}

export const LinkDatabaseModal = ({
  app,
  database,
  onOpenChange,
  isOpen,
}: LinkDatabaseModalProps) => {
  const [linkLogHistory, setLinkLogHistory] = useState<LogPayload[]>([]);
  const router = useRouter();

  const [linkDatabaseMutation, { loading: databaseLinkLoading }] =
    useLinkDatabaseMutation();

  useLinkDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.linkDatabaseLogs;
      if (logsExist) {
        setLinkLogHistory((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        switch (logsExist.type) {
          case "end:success":
            toast.success("Enlace exitoso");
            break;
          case "end:failure":
            toast.error("Enlace fallido");
            break;
        }
      }
    },
  });

  useEffect(() => {
    setLinkLogHistory([]);
  }, [app, database, isOpen]);

  const handleConnect = async (databaseId: string, appId: string) => {
    try {
      await linkDatabaseMutation({
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

  const isTerminalVisible = linkLogHistory.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      closeButton
      onOpenChange={(val) => {
        if (
          !val &&
          linkLogHistory[linkLogHistory.length - 1]?.type === "end:success"
        ) {
          router.refresh();
        }
        onOpenChange(val);
      }}
      size={isTerminalVisible ? "5xl" : "md"}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h4>Enlazar base de datos</h4>
        </ModalHeader>
        <ModalBody>
          {isTerminalVisible ? (
            <>
              <p className="mb-2">
                ¡Enlazando base de datos <b>{database?.name}</b> con{" "}
                {app && <b>{app.name}</b>}!
              </p>
              <p>
                El proceso de enlace usualmente tarda unos minutos. Respira un
                poco, los registros aparecerán pronto:
              </p>
              <Terminal
                scrollOnNew
                className="w-6/6"
                logs={linkLogHistory.map((it) => it.message)}
              />
            </>
          ) : (
            <p>
              ¿Estás seguro de enlazar la base de datos <b>{database?.name}</b>{" "}
              con {app && <b>{app.name}</b>}?
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
                handleConnect(database?.id!, app?.id!);
              }}
              disabled={isTerminalVisible}
              isLoading={databaseLinkLoading}
            >
              Enlazar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
