import React from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../../lib/withApollo';

import { Protected } from '../../../modules/auth/Protected';
import { Header } from '../../../modules/layout/Header';
import { useAppByIdQuery, useAppLogsQuery } from '../../../generated/graphql';
import Link from 'next/link';

const App = () => {
  const router = useRouter();
  // // On first render appId will be undefined, the value is set after and a rerender is triggered.
  const { appId } = router.query as { appId?: string };
  const { data, loading, error } = useAppByIdQuery({
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
    error: appLogsError,
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
        <nav className="flex space-x-5 text-sm leading-5 border-b border-gray-200">
          <Link href="/app/[appId]" as={`/app/${app.id}`} passHref>
            <a className="-mb-px border-b border-black text-black py-3 px-0.5">
              App
            </a>
          </Link>
          <Link href="/app/[appId]/env" as={`/app/${app.id}/env`} passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Env setup
            </a>
          </Link>
          <Link
            href="/app/[appId]/settings"
            as={`/app/${app.id}/settings`}
            passHref
          >
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Settings
            </a>
          </Link>
          <Link href="/dashboard" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-15">
              Return to dashboard
            </a>
          </Link>
        </nav>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <div>
            <h1 className="text-lg font-bold py-5">App info</h1>
            <div className=" bg-gray-100 shadow overflow-hidden rounded-lg border-b border-gray-200">
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
            <div
              className="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
              bg-gray-900 pb-16 pt-4 rounded-lg leading-normal overflow-hidden h-auto"
            >
              <div className="mt-4 flex">
                <p className="flex-1 typing items-center pl-2">{`App status:`}</p>
                {!appLogsData ? (
                  <span className="text-yellow-400">
                    App is still deploying
                  </span>
                ) : (
                  <span className="text-green-400">
                    {appLogsLoading ? 'Loading...' : appLogsData.appLogs.logs}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg">
            Connect database
          </button>
        </div>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <App />
  </Protected>
));
