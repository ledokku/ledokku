import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AnsiUp from 'ansi_up';
import { Header } from '../../modules/layout/Header';
import { useAppByIdQuery, useAppLogsQuery } from '../../generated/graphql';
import {
  TabNav,
  TabNavLink,
  Terminal,
  Alert,
  AlertDescription,
} from '../../ui';

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/app/${app.id}`}>App</TabNavLink>
          <TabNavLink to={`/app/${app.id}/databases`} selected>
            Logs
          </TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`}>Settings</TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold py-5 mt-10">
          Logs for {app.name} app:
        </h1>

        {appLogsLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : null}

        {appLogsError ? (
          <Alert status="error">
            <AlertDescription>{appLogsError.message}</AlertDescription>
          </Alert>
        ) : null}

        {!appLogsLoading && !appLogsError && !appLogsData ? (
          <Alert status="info">
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
      </div>
    </div>
  );
};
