import React, { useState } from 'react';
import { Header } from '../../modules/layout/Header';
import {
  useDatabaseByIdQuery,
  useAppsQuery,
  useLinkDatabaseMutation,
  DatabaseByIdDocument,
} from '../../generated/graphql';
import { useParams, Link } from 'react-router-dom';
import Select from 'react-select';
import { TabNav, TabNavLink, Button } from '../../ui';

export const Database = () => {
  const { id: databaseId } = useParams();
  const [selectedApp, setSelectedApp] = useState({
    value: { name: '', id: '' },
    label: 'Please select an app',
  });
  const [
    linkDatabaseMutation,
    {
      data: databaseLinkData,
      loading: databaseLinkLoading,
      error: databaseLinkError,
    },
  ] = useLinkDatabaseMutation();

  const { data: appsData } = useAppsQuery();

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

  const linkedApps = database.apps;
  const linkedIds = linkedApps.map((db) => db.id);
  const notLinkedApps = apps.filter((db) => {
    return linkedIds.indexOf(db.id) === -1;
  });

  const appOptions = notLinkedApps.map((app) => {
    return {
      value: { name: app.name, id: app.id },
      label: app.name,
    };
  });

  const handleConnect = async (databaseId: string, appId: string) => {
    try {
      await linkDatabaseMutation({
        variables: {
          input: {
            databaseId,
            appId,
          },
        },
        refetchQueries: [
          { query: DatabaseByIdDocument, variables: { databaseId } },
        ],
      });
      setSelectedApp({
        value: { name: '', id: '' },
        label: 'Please select an app',
      });
      // TODO - REACT - TOASTIFY
    } catch (e) {
      //TODO - REACT TOASTIFY
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
                    Create app
                  </Button>
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {notLinkedApps.length !== 0 ? (
                  <div>
                    <Select
                      value={selectedApp}
                      onChange={setSelectedApp}
                      className="mt-3 w-80"
                      options={appOptions}
                      placeholder={selectedApp}
                      isSearchable={false}
                      aria-labelledby="app-select-dropdown"
                      noOptionsMessage={() =>
                        'All of your apps are already linked to this database'
                      }
                    />

                    {databaseLinkError && (
                      <p className="text-red-500 text-sm font-semibold">
                        {databaseLinkError.graphQLErrors[0].message}
                      </p>
                    )}
                    <Button
                      color="grey"
                      width="large"
                      className="mt-2"
                      isLoading={
                        databaseLinkLoading &&
                        !databaseLinkData &&
                        !databaseLinkError
                      }
                      disabled={!selectedApp.value.id || databaseLinkLoading}
                      onClick={() =>
                        handleConnect(databaseId, selectedApp.value.id)
                      }
                    >
                      Link app
                    </Button>
                  </div>
                ) : (
                  <React.Fragment>
                    <p className="mt-3 mb-3 mr-8 text-cool-gray-400">
                      All your apps are already linked to this database! If you
                      want to create more apps proceed with create app flow.
                    </p>
                    <div className="ml-80">
                      <Link to="/create-app">
                        <Button
                          color={'grey'}
                          variant="outline"
                          className="text-sm mr-3"
                        >
                          Create app
                        </Button>
                      </Link>
                    </div>
                  </React.Fragment>
                )}

                {!loading && database && database.apps && (
                  <React.Fragment>
                    <h2 className="mb-1 mt-3 font-semibold">
                      {database.apps.length > 0 && 'Linked apps'}
                    </h2>
                    {database.apps.map((app) => (
                      <div className="w-64" key={app.id}>
                        <Link to={`/app/${app.id}`} className="py-2 block">
                          <div className="flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                            {app.name}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
