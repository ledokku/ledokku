import { App } from "@/generated/graphql.server";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogPayload,
  useAppRebuildLogsSubscription,
  useRebuildAppMutation,
} from "@/generated/graphql";
import { Terminal } from "@/ui/components/misc/Terminal";
import toast from "react-hot-toast";
import { FiCodepen } from "react-icons/fi";

interface AppRebuildProps {
  app: App;
}

export const AppRebuild = ({ app }: AppRebuildProps) => {
  const [logHistory, setLinkLogHistory] = useState<LogPayload[]>([]);
  const [isRebuildAppModalOpen, setIsRebuildAppModalOpen] = useState(false);

  const [rebuildAppMutation, { loading: rebuildLoading }] =
    useRebuildAppMutation();

  useAppRebuildLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appRebuildLogs;
      if (logsExist) {
        setLinkLogHistory((currentLogs) => {
          return [...currentLogs, logsExist];
        });

        switch (logsExist.type) {
          case "end:success":
            toast.success("Re-compilación exitosa");
            break;
          case "end:failure":
            toast.error("Re-compilación fallida");
            break;
        }
      }
    },
  });

  useEffect(() => {
    setLinkLogHistory([]);
  }, [isRebuildAppModalOpen, app]);

  const isTerminalVisible = logHistory.length > 0;

  const handleRebuildApp = async () => {
    try {
      await rebuildAppMutation({
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
      <h3>Re-compilar</h3>
      <p>Re-compila la aplicación y ve los registros en tiempo real.</p>

      <div className="mt-4">
        <Button
          onClick={() => setIsRebuildAppModalOpen(true)}
          color="primary"
          startContent={<FiCodepen />}
        >
          Re-compilar
        </Button>
      </div>
      <Modal
        size={isTerminalVisible ? "5xl" : "md"}
        backdrop="blur"
        closeButton
        onOpenChange={setIsRebuildAppModalOpen}
        isOpen={isRebuildAppModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            <h4>Re-compilar</h4>
          </ModalHeader>
          <ModalBody>
            {isTerminalVisible ? (
              <div>
                <p className="mb-2 ">Re-compilando {app.name}</p>
                <p className="text-foreground-500 mb-2">
                  Re-compilar la app toma algunos minutos. Respira un poco, los
                  registros aparecerán pronto:
                </p>
                <Terminal
                  scrollOnNew
                  logs={logHistory.map((it) => it.message)}
                />
              </div>
            ) : (
              <p>
                ¿Estás seguro de re-compilar la aplicación <b>{app.name}</b>?
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="bordered"
              onClick={() => {
                setIsRebuildAppModalOpen(false);
              }}
            >
              {isTerminalVisible ? "Cerrar" : "Cancelar"}
            </Button>
            {!isTerminalVisible && (
              <Button
                disabled={isTerminalVisible}
                size="sm"
                color="warning"
                onClick={handleRebuildApp}
                isLoading={rebuildLoading}
              >
                Compilar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
