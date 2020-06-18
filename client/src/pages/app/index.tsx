import React from 'react';
import { Header } from '../../modules/layout/Header';
import { useAppByIdQuery, useAppLogsQuery } from '../../generated/graphql';
import { useParams } from 'react-router-dom';
import { TabNav, TabNavLink, Terminal } from '../../ui';

export const App = () => {
  const { id: appId } = useParams();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  // TODO solve issue when app is not deployed - logs are undefined

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
          <TabNavLink to={`/app/${app.id}`} selected>
            App
          </TabNavLink>
          <TabNavLink to={`/app/${app.id}/databases`}>Databases</TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`}>Settings</TabNavLink>
          <TabNavLink to="/dashboard">Return to dashboard</TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <div>
            <h1 className="text-lg font-bold py-5">App info</h1>
            <div className="mt-3 bg-gray-100 shadow overflow-hidden rounded-lg border-b border-gray-200">
              <table className="mt-4 mb-4 min-w-full bg-white">
                <tbody className="text-gray-700">
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      App name
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">{app.name}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      id
                    </td>
                    <td className="w-3/4 text-left py-3 px-4">{app.id}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      GithubRepo
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">
                      {app.githubRepoUrl}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      Created at
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">
                      {app.createdAt}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full">
            <h1 className="font-bold text-lg font-bold py-5">Logs</h1>
            <Terminal className="pt-8 pb-16">
              <div className="flex">
                <p className="flex-1 typing items-center pl-2">{`App status:`}</p>
                {!appLogsData && !appLogsLoading ? (
                  <span className="text-yellow-400">
                    App is still deploying
                  </span>
                ) : (
                  <span className="text-green-400">
                    {appLogsLoading ? 'Loading...' : appLogsData.appLogs.logs}
                  </span>
                )}
              </div>
            </Terminal>
          </div>
        </div>
      </div>
    </div>
  );
};
