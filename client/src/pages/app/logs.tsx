import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../modules/layout/Header';
import { useAppByIdQuery, useAppLogsQuery } from '../../generated/graphql';
import { TabNav, TabNavLink, Terminal } from '../../ui';

export const Logs = () => {
  const { id: appId } = useParams();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  const {
    data: appLogsData,
    loading: appLogsLoading,
    /* error: appLogsError, */
  } = useAppLogsQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Logs</h1>
        </div>
        <Terminal className="pt-8 pb-16">
          <div>
            <p className=" typing items-center pl-2">{`Logs for ${app.name} app:`}</p>
            {!appLogsData && !appLogsLoading ? (
              <p className="text-yellow-400">App is still deploying</p>
            ) : (
              <div>
                {appLogsLoading ? (
                  <p className="pl-2 text-green-400">Loading...</p>
                ) : (
                  appLogsData.appLogs.logs.map((log) => (
                    <p
                      key={appLogsData.appLogs.logs.indexOf(log)}
                      className="mt-1 text-green-400"
                    >
                      {log}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </Terminal>
      </div>
    </div>
  );
};
