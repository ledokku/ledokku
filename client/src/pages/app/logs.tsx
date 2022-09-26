import { useParams } from 'react-router-dom';
import { useAppByIdQuery, useAppLogsQuery } from '../../generated/graphql';
import { Header, Terminal } from '../../ui';
import { AppHeaderTabNav } from '../../modules/app/AppHeaderTabNav';
import { AppHeaderInfo } from '../../modules/app/AppHeaderInfo';
import { Container, Loading, Text } from '@nextui-org/react';
import { Alert } from '../../ui/components/Alert';
import { TerminalOutput } from 'react-terminal-ui';

export const Logs = () => {
  const { id: appId } = useParams<{ id: string }>();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
  });

  const {
    data: appLogsData,
    loading: appLogsLoading,
    error: appLogsError,
  } = useAppLogsQuery({
    variables: {
      appId,
    },
    // we fetch status every 2 min 30 sec
    pollInterval: 15000,
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <div>
      <div>
        <Header />
        <AppHeaderInfo app={app} />
        <AppHeaderTabNav app={app} />
      </div>

      <Container className='py-16'>
        <Text h3 >
          Registros de "{app.name}":
        </Text>

        {appLogsLoading ? (
          <Loading />
        ) : null}

        {appLogsError ? (
          <Alert
            type="error"
            message={appLogsError.message}
          />
        ) : null}

        {!appLogsLoading && !appLogsError && !appLogsData ? (
          <Alert
            type="info"
            message={`No hay registros de "${app.name}".
            La aplicación no se ha lanzado o se esta lanzando.`}
          />
        ) : null}

        {appLogsData?.appLogs ? (
          <Terminal>
            {appLogsData.appLogs.logs.map((log, index) => (
              <TerminalOutput key={index}>{log}</TerminalOutput>
            ))}
          </Terminal>
        ) : null}
      </Container>
    </div>
  );
};
