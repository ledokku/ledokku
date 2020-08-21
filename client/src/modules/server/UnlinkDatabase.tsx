import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { config } from '../../config';
import { dbTypeToDokkuPlugin } from '../../pages/utils';

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

interface UnlinkDatabaseProps {
  databaseName: any;
  databaseType: any;
  appName: any;
}

export const UnlinkDatabase = ({
  databaseName,
  databaseType,
  appName,
}: UnlinkDatabaseProps) => {
  const [logs, setLogs] = useState<RealtimeLog[]>([]);
  const dbType = dbTypeToDokkuPlugin(databaseType);
  console.log('has rendered');

  useEffect(() => {
    const socket = socketIOClient(config.serverUrl);
    console.log(`listening to: hello`);
    socket.on(`hello`, (data: RealtimeLog[]) => {
      setLogs((previousLogs) => {
        const newLogs = [...previousLogs, ...data];
        return newLogs;
      });
      console.log('received unlink db', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [dbType, databaseName, appName]);

  return (
    <div>
      {logs.map((log, index) => (
        <div key={index}>
          <b>{log.type}:</b> {log.message}
        </div>
      ))}
    </div>
  );
};
