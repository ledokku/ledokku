import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Heading,
  Alert,
  AlertDescription,
  Text,
} from '@chakra-ui/react';
import AnsiUp from 'ansi_up';
import { Header } from '../../modules/layout/Header';
import { useAppByIdQuery, useAppLogsQuery } from '../../generated/graphql';
import { TabNav, TabNavLink, Terminal } from '../../ui';

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
      <Header />
      <Container maxW="5xl">
        <TabNav>
          <TabNavLink to={`/app/${app.id}`}>App</TabNavLink>
          <TabNavLink to={`/app/${app.id}/databases`} selected>
            Logs
          </TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`}>Settings</TabNavLink>
        </TabNav>
      </Container>

      <Container maxW="5xl" mt={10}>
        <Heading as="h2" size="md" py={5}>
          Logs for {app.name} app:
        </Heading>

        {appLogsLoading ? (
          <Text fontSize="sm" color="gray.400">
            Loading...
          </Text>
        ) : null}

        {appLogsError ? (
          <Alert
            status="error"
            variant="top-accent"
            borderBottomRadius="base"
            boxShadow="md"
          >
            <AlertDescription>{appLogsError.message}</AlertDescription>
          </Alert>
        ) : null}

        {!appLogsLoading && !appLogsError && !appLogsData ? (
          <Alert
            status="info"
            variant="top-accent"
            borderBottomRadius="base"
            boxShadow="md"
          >
            <AlertDescription>
              There are no logs for {app.name}.
              <br />
              App is not deployed or still deploying.
            </AlertDescription>
          </Alert>
        ) : null}

        {memoizedLogsHtml ? (
          <Terminal className="mb-8">
            {memoizedLogsHtml.map((html, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: html }}></p>
            ))}
          </Terminal>
        ) : null}
      </Container>
    </div>
  );
};
