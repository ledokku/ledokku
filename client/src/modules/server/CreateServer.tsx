import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { config } from '../../config';
import { Box, Typography, LogBox } from '../../ui';
import { ServerByIdQuery } from '../../generated/graphql';
import { serverTypeReadableName } from '../../utils';

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

interface CreateServerProps {
  server: ServerByIdQuery['server'];
}

export const CreateServer = ({ server }: CreateServerProps) => {
  const [logs, setLogs] = useState<RealtimeLog[]>([]);

  useEffect(() => {
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

  return (
    <Box
      marginLeft={{
        desktop: 80,
        tablet: 40,
        phone: 24,
      }}
      marginRight={{
        desktop: 80,
        tablet: 40,
        phone: 24,
      }}
      marginBottom={{
        desktop: 80,
        tablet: 40,
        phone: 24,
      }}
    >
      <Typography.Headline
        level={2}
        marginTop={80}
        marginBottom={80}
        textAlign="center"
      >
        Your server <b>{server.name}</b> is being created
      </Typography.Headline>

      <LogBox
        title={
          <React.Fragment>
            Logs from <b>{serverTypeReadableName(server.type)}</b>
            {server.ip && `-${server.ip}`}
          </React.Fragment>
        }
      >
        {logs.map((log, index) => (
          <div key={index}>
            <b>{log.type}:</b> {log.message}
          </div>
        ))}
      </LogBox>
    </Box>
  );
};
