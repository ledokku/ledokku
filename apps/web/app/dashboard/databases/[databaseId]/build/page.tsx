"use client";

import { useState } from "react";
import {
  LogPayload,
  useCreateDatabaseLogsSubscription,
} from "@/generated/graphql";
import toast from "react-hot-toast";
import { Terminal } from "@/ui/components/misc/Terminal";
import { useDatabaseContext } from "@/contexts/DatabaseContext";

export default function DatabaseBuild() {
  const database = useDatabaseContext();
  const [arrayOfCreateDatabaseLogs, setArrayOfCreateDatabaseLogs] = useState<
    LogPayload[]
  >([]);

  useCreateDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.createDatabaseLogs;

      if (logsExist) {
        setArrayOfCreateDatabaseLogs((currentLogs) => {
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
        Creando la base de datos <b>{database.database.name}</b>.
      </p>
      <p className="mb-4">
        Crear una base de datos usualmente toma unos cuantos minutos. Respira un
        poco, los registros aparecerán pronto:
      </p>
      <Terminal
        scrollOnNew
        logs={arrayOfCreateDatabaseLogs.map((it) => it.message)}
      />
    </div>
  );
}
