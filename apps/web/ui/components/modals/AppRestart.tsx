"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { App } from "@/generated/graphql.server";
import { useRouter } from "next/navigation";
import {
  LogPayload,
  useAppRestartLogsSubscription,
  useRestartAppMutation,
} from "@/generated/graphql";
import { Terminal } from "@/ui/components/misc/Terminal";
import toast from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";

interface AppRestartProps {
  app: App;
}

export const AppRestart = ({ app }: AppRestartProps) => {
  const [logHistory, setLinkLogHistory] = useState<LogPayload[]>([]);
  const [isRestartAppModalOpen, setIsRestartAppModalOpen] = useState(false);

  const [restartAppMutation, { loading: restartLoading }] =
    useRestartAppMutation();

  useAppRestartLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appRestartLogs;
      if (logsExist) {
        setLinkLogHistory((currentLogs) => {
          return [...currentLogs, logsExist];
        });

        switch (logsExist.type) {
          case "end:success":
            toast.success("Reinicio exitoso");
            break;
          case "end:failure":
            toast.error("Reinicio fallido");
            break;
        }
      }
    },
  });

  useEffect(() => {
    setLinkLogHistory([]);
  }, [isRestartAppModalOpen, app]);

  const isTerminalVisible = logHistory.length > 0;

  const handleRestartApp = async () => {
    try {
      await restartAppMutation({
        variables: {
          input: {
            appId: app.id,
          },
        },
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <h3>Reiniciar aplicación</h3>
      <p>Reinicia tu aplicación y ve los registros en tiempo real.</p>

      <div className="mt-4">
        <Button
          onClick={() => setIsRestartAppModalOpen(true)}
          color="primary"
          startContent={<FiRefreshCw />}
        >
          Reiniciar
        </Button>
      </div>
      <Modal
        size={isTerminalVisible ? "5xl" : "md"}
        backdrop="blur"
        onOpenChange={setIsRestartAppModalOpen}
        isOpen={isRestartAppModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            <h4>Reinciar aplicación</h4>
          </ModalHeader>
          <ModalBody>
            {isTerminalVisible ? (
              <div>
                <p className="mb-2">
                  Reiniciando <b>{app.name}</b>
                </p>
                <p className="text-foreground-500 mb-2">
                  Reiniciar la app toma algunos minutos. Respira un poco, los
                  registros aparecerán pronto:
                </p>
                <Terminal
                  scrollOnNew
                  logs={logHistory.map((it) => it.message)}
                />
              </div>
            ) : (
              <p>
                ¿Estás seguro de que deseas reiniciar <b>{app.name}</b>?
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="bordered"
              onClick={() => {
                setIsRestartAppModalOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={isTerminalVisible}
              size="sm"
              color="warning"
              onClick={() => {
                handleRestartApp();
              }}
              isLoading={restartLoading}
            >
              Reiniciar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
