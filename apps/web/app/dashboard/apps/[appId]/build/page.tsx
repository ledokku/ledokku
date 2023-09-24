"use client";

import { useEffect, useState } from "react";
import {
  LogPayload,
  useAppByIdQuery,
  useAppCreateLogsSubscription,
  useGetCreateLogsQuery,
} from "@/generated/graphql";
import toast from "react-hot-toast";
import { Terminal } from "@/ui/components/misc/Terminal";
import { useAppContext } from "@/contexts/AppContext";

const AppBuild = () => {
  const app = useAppContext();
  const [arrayOfCreateAppLogs, setArrayOfCreateAppLogs] = useState<
    LogPayload[]
  >([]);

  const {
    data: logs,
    loading: loadingLogs,
    error: errorLogs,
  } = useGetCreateLogsQuery({
    variables: {
      appId: app.id,
    },
  });

  useEffect(() => {
    if (logs) {
      setArrayOfCreateAppLogs(logs.createLogs);
    }
  }, [logs]);

  useAppCreateLogsSubscription({
    variables: {
      appId: app.id,
    },
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appCreateLogs;

      if (logsExist) {
        setArrayOfCreateAppLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (logsExist.type === "end:success") {
          toast.success("Aplicación creada");
        } else if (logsExist.type === "end:failure") {
          toast.error("Error al crear aplicación");
        }
      }
    },
  });

  return (
    <div>
      <p>
        Creando la aplicación <b>{app.name}</b> desde{" "}
        <b>
          {app.appMetaGithub?.repoOwner}/{app.appMetaGithub?.repoName}
        </b>
      </p>
      <p className="mb-4">
        Crear una aplicación usualmente toma unos cuantos minutos. Respira un
        poco, los registros aparecerán pronto:
      </p>
      <Terminal
        scrollOnNew
        loading={loadingLogs}
        logs={arrayOfCreateAppLogs.map((it) => it.message)}
      />
    </div>
  );
};

export default AppBuild;
