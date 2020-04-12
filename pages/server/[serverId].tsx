import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import socketIOClient from 'socket.io-client';

import withApollo from '../../lib/withApollo';
import { config } from '../../config';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';
import { Box, Typography, LogBox } from '../../ui';

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

const tempLogs: RealtimeLog[] = [
  {
    type: 'command',
    message: 'Ondrej-MacBook-Pro:ledokku ondrejbarta$ yarn dev',
  },
  { type: 'command', message: 'yarn run v1.17.3' },
  { type: 'command', message: '$ next' },
  { type: 'command', message: '[ wait ]  starting the development server ...' },
  {
    type: 'command',
    message: '[ info ]  waiting on http://localhost:3000 ...',
  },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  { type: 'command', message: '[ event ] build page: /next/dist/pages/_error' },
  { type: 'command', message: '[ wait ]  compiling ...' },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  { type: 'command', message: '[ event ] build page: /next/dist/pages/_error' },
  { type: 'command', message: '[ wait ]  compiling ...' },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  { type: 'command', message: '[ wait ]  starting the development server ...' },
  {
    type: 'command',
    message: '[ info ]  waiting on http://localhost:3000 ...',
  },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  { type: 'command', message: '[ event ] build page: /next/dist/pages/_error' },
  { type: 'command', message: '[ wait ]  compiling ...' },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
  { type: 'command', message: '[ event ] build page: /next/dist/pages/_error' },
  { type: 'command', message: '[ wait ]  compiling ...' },
  {
    type: 'command',
    message: '[ info ]  bundled successfully, waiting for typecheck results...',
  },
  {
    type: 'command',
    message: '[ ready ] compiled successfully - ready on http://localhost:3000',
  },
];

const Server = () => {
  const router = useRouter();
  const { serverId } = router.query;
  const [logs, setLogs] = useState<RealtimeLog[]>([]);

  useEffect(() => {
    setInterval(() => {
      const randomLog = tempLogs[Math.floor(Math.random() * tempLogs.length)];
      setLogs((previousLogs) => {
        const newLogs = [...previousLogs, randomLog];
        return newLogs;
      });
    }, 500);
  }, []);

  useEffect(() => {
    const socket = socketIOClient(config.serverUrl);
    socket.on(`create-server:${serverId}`, (data: RealtimeLog) => {
      setLogs((previousLogs) => {
        const newLogs = [...previousLogs, data];
        return newLogs;
      });
      console.log('received create-server', data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: 'Berlin Library Project',
        },
      ]}
    >
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
      >
        <Typography.Headline
          level={2}
          marginTop={80}
          marginBottom={80}
          textAlign="center"
        >
          Your server <b>Berlin Library Project</b> is being created
        </Typography.Headline>

        <LogBox
          title={
            <React.Fragment>
              Logs from <b>Digital Ocean</b>—70.98.192.00
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
    </LoggedInLayout>
  );
};

export default withApollo(Server);
