import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import socketIOClient from 'socket.io-client';

import withApollo from '../../lib/withApollo';
import { config } from '../../config';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';
import { Box, Typography, LogBox } from '../../ui';
import { useServerByIdQuery } from '../../src/generated/graphql';

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

const Server = () => {
  const router = useRouter();
  const { serverId } = router.query as { serverId: string };
  const { data, loading, error } = useServerByIdQuery({
    variables: {
      id: serverId,
    },
    ssr: false,
  });
  const [logs, setLogs] = useState<RealtimeLog[]>([]);

  console.log(data, loading, error, serverId);

  useEffect(() => {
    if (serverId) {
      const socket = socketIOClient(config.serverUrl);
      console.log(`listening to create-server:${serverId}`);
      socket.on(`create-server:${serverId}`, (data: RealtimeLog) => {
        setLogs((previousLogs) => {
          const newLogs = [...previousLogs, data];
          return newLogs;
        });
        console.log('received create-server', data);
      });
    }

    // TODO  socket.disconnect(); on unmount
  }, [serverId]);

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
