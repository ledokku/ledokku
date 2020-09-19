import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { config } from '../../config';
// import { ServerByIdQuery } from '../../generated/graphql';

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

interface CreateServerProps {
  server: any;
}

export const CreateServer = ({ server }: CreateServerProps) => {
  const [logs, setLogs] = useState<RealtimeLog[]>([]);

  useEffect(() => {
    // we will remove socket.io so all good
    // @ts-ignore
    const socket = socketIOClient(config.serverUrl);
    console.log(`listening to create-server:${server.id}`);
    socket.on(`create-server:${server.id}`, (data: RealtimeLog[]) => {
      setLogs((previousLogs) => {
        const newLogs = [...previousLogs, ...data];
        return newLogs;
      });
      console.log('received create-server', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [server.id]);

  return null;
};
