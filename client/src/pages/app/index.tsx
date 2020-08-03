import React, { useState } from 'react';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDatabaseQuery,
  useLinkDatabaseMutation,
} from '../../generated/graphql';
import { dbLinkingGraphQLErrorParse } from '../utils';
import { useParams, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { TabNav, TabNavLink, Button, Spinner } from '../../ui';

export const App = () => {
  const { id: appId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDb, setSelectedDb] = useState({
    name: 'Select DB to link',
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

  const { data: databaseData } = useDatabaseQuery();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { databases } = databaseData;

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
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
          <TabNavLink to={`/app/${app.id}`} selected>
            App
          </TabNavLink>
          <TabNavLink to={`/app/${app.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`}>Settings</TabNavLink>
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
            <h1 className="font-bold text-lg font-bold py-5">Databases</h1>
            {databases.length === 0 ? (
              <React.Fragment>
                <div className="mt-4 mb-4">
                  <h2 className="text-gray-400">
                    Currently you haven't created any databases, to do so
                    proceed with the database creation flow
                  </h2>
                </div>
                <Link to="/create-database">
                  <Button width="large" color={'grey'}>
                    Create a database
                  </Button>
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  className="w-64 rounded-md bg-white shadow-xs mt-3"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="database-link-menu"
                >
                  <div className="border-t border-gray-100" />

                  <div
                    className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md shadow-lg"
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen);
                    }}
                  >
                    <span className="flex-1"> {selectedDb.name}</span>
                    <div className="ml-20 -mr-2  w-6">
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
                      aria-labelledby="database-link-menu"
                    >
                      <div className="border-t border-gray-100" />
                      <div className="py-1">
                        {databases.map((db) => (
                          <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            role="menuitem"
                            onClick={() => {
                              setSelectedDb({ name: db.name, id: db.id });
                              setIsMenuOpen(!isMenuOpen);
                            }}
                          >
                            {db.name}
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
                      false
                    )}
                  </p>
                )}
                <Button
                  color="grey"
                  width="large"
                  className="mt-2"
                  disabled={!selectedDb.id || databaseLinkLoading}
                  onClick={() => handleConnect(selectedDb.id, appId)}
                >
                  {databaseLinkLoading &&
                  !databaseLinkData &&
                  !databaseLinkError ? (
                    <Spinner size="small" />
                  ) : (
                    'Link database'
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
