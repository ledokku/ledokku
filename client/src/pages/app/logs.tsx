import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AnsiUp from 'ansi_up';
import { useAppByIdQuery, useAppLogsQuery } from '../../generated/graphql';
import { Header, Terminal } from '../../ui';
import { AppHeaderTabNav } from '../../modules/app/AppHeaderTabNav';
import { AppHeaderInfo } from '../../modules/app/AppHeaderInfo';
import { Container, Loading, Text } from '@nextui-org/react';
import { Alert } from '../../ui/components/Alert';

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

  const memoizedLogsHtml = useMemo(() => {
    if (!appLogsData?.appLogs.logs) {
      return null;
    }
    const data = appLogsData.appLogs.logs.map((log) => {
      const ansiIUp = new AnsiUp();
      const html = ansiIUp.ansi_to_html(log);
      return html;
    });
    return data;
  }, [appLogsData]);

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

      <Container>
        <Text h3 className='mt-16'>
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
            message={`No hay logs de "${app.name}".
            La aplicación no se ha lanzado o se esta lanzando.`}
          />
        ) : null}

        {memoizedLogsHtml ? (
          <Terminal>
            {memoizedLogsHtml.map((html, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: html }}></p>
            ))}
          </Terminal>
        ) : null}
      </Container>
    </div>
  );
};
