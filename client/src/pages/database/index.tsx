import React, { useState } from 'react';
import { Header } from '../../modules/layout/Header';
import {
  useDatabaseByIdQuery,
  useAppsQuery,
  useLinkDatabaseMutation,
} from '../../generated/graphql';
import { useParams, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { TabNav, TabNavLink, Button, Spinner } from '../../ui';
import { dbLinkingGraphQLErrorParse } from '../utils';

export const Database = () => {
  const { id: databaseId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState({
    name: 'Select app to link',
    id: '',
  });
  const [
    linkDatabaseMutation,
    {
      data: databaseLinkData,
      loading: databaseLinkLoading,
      error: databaseLinkError,
    },
  ] = useLinkDatabaseMutation();

  const { data: appsData, loading: loadingApps } = useAppsQuery();
  const { data, loading /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { database } = data;
  const { apps } = appsData;

  if (!database) {
    // TODO nice 404
    return <p>Database not found.</p>;
  }

  const handleConnect = async (databaseId: string, appId: string) => {
    try {
      await linkDatabaseMutation({
        variables: {
          input: {
            databaseId,
            appId,
          },
        },
      });
    } catch (e) {
      //
    }
  };

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/database/${database.id}`} selected>
            Database
          </TabNavLink>

          <TabNavLink to={`/database/${database.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/database/${database.id}/settings`}>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <div>
            <h1 className="text-lg font-bold py-5">Database info</h1>
            <div className="mt-3 bg-gray-100 shadow overflow-hidden rounded-lg border-b border-gray-200">
              <table className="mt-4 mb-4 min-w-full bg-white">
                <tbody className="text-gray-700">
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      Database name
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">
                      {database.name}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      id
                    </td>
                    <td className="w-3/4 text-left py-3 px-4">{database.id}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      Type
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">
                      {database.type}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full">
            <h1 className="font-bold text-lg font-bold py-5">Apps</h1>
            {apps.length === 0 ? (
              <React.Fragment>
                <div className="mt-3 mb-4">
                  <h2 className="text-gray-400">
                    Currently you haven't created apps, to do so proceed with
                    the app creation flow
                  </h2>
                </div>
                <Link to="/create-app">
                  <Button width="large" color={'grey'}>
                    Create an app
                  </Button>
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  className=" w-64 rounded-md bg-white shadow-xs mt-3"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="app-link-menu"
                >
                  <div className="border-t border-gray-100" />

                  <div
                    className="flex flex-row px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md shadow-lg"
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen);
                    }}
                  >
                    {selectedApp.name}

                    <div className="ml-20 -mr-4 w-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <CSSTransition
                  in={isMenuOpen}
                  timeout={0}
                  classNames={{
                    enter:
                      'transition ease-out duration-100 transform opacity-0 scale-95',
                    enterActive: 'transform opacity-100 scale-100',
                    exit:
                      'transition ease-in duration-75 transform opacity-100 scale-100',
                    exitActive: 'transform opacity-0 scale-95',
                  }}
                  unmountOnExit
                >
                  <div className="origin-top-right mt-2 w-64 rounded-md shadow-lg">
                    <div
                      className="rounded-md bg-white shadow-xs"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="app-link-menu"
                    >
                      <div className="border-t border-gray-100" />
                      <div className="py-1">
                        {apps.map((app) => (
                          <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            role="menuitem"
                            onClick={() => {
                              setSelectedApp({ name: app.name, id: app.id });
                              setIsMenuOpen(!isMenuOpen);
                            }}
                          >
                            {app.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CSSTransition>
                {databaseLinkError && (
                  <p className="text-red-500 text-sm font-semibold">
                    {dbLinkingGraphQLErrorParse(
                      databaseLinkError.message,
                      true
                    )}
                  </p>
                )}
                <Button
                  color="grey"
                  width="large"
                  className="mt-2"
                  disabled={!selectedApp.id || databaseLinkLoading}
                  onClick={() => handleConnect(databaseId, selectedApp.id)}
                >
                  {databaseLinkLoading &&
                  !databaseLinkData &&
                  !databaseLinkError ? (
                    <Spinner size="small" />
                  ) : (
                    'Link app'
                  )}
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
