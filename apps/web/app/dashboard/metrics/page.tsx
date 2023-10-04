"use client";

import { useState } from "react";
import {
  LogPayload,
  useLedokkuLogsQuery,
  useOnLedokkuLogsSubscription,
} from "@/generated/graphql";
import { Terminal } from "@/ui/components/misc/Terminal";

const Metrics = () => {
  const [data, setData] = useState<LogPayload[]>([]);
  const { loading: loadingLogs } = useLedokkuLogsQuery({
    onCompleted(logs) {
      if (logs && logs.ledokkuLogs.length > 0) {
        setData([...logs.ledokkuLogs, ...data]);
      }
    },
  });

  useOnLedokkuLogsSubscription({
    onSubscriptionData(options) {
      const sub = options.subscriptionData.data?.onLedokkuLog;
      if (sub) {
        setData([...data, sub]);
      }
    },
  });

  return (
    <>
      <h2 className="mb-4">Métricas</h2>
      <h3 className="mb-2">Registros de Ledokku</h3>
      <Terminal
        loading={loadingLogs}
        scrollOnNew
        logs={data.map((it) => it.message)}
      />
    </>
  );
};

export default Metrics;
