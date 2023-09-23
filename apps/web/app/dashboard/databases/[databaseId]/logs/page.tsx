"use client";

import { useDatabaseLogsQuery } from "@/generated/graphql";
import { Alert } from "@/ui/components/alerts/Alert";
import { Terminal } from "@/ui/components/misc/Terminal";
import { PageProps } from "@/types/next";

export default function DatabaseLogs({ params }: PageProps) {
  const { data, loading } = useDatabaseLogsQuery({
    variables: {
      databaseId: params.databaseId,
    },
    pollInterval: 1000,
  });

  return (
    <>
      <h3 className="my-6">Registros de ejecución:</h3>

      {(data?.databaseLogs.logs.length ?? 0) === 0 && !loading ? (
        <Alert
          type="primary"
          title="No hay registros de la aplicación."
          message={`No hay registros de la aplicación.
            La aplicación no se ha lanzado o se esta lanzando.`}
        />
      ) : (
        <Terminal
          logs={data?.databaseLogs.logs}
          loading={loading}
          scrollOnNew
        />
      )}
    </>
  );
}
