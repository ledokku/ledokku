import React, { useState } from 'react';
import Select from 'react-select';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDatabaseQuery,
  useLinkDatabaseMutation,
  AppByIdDocument,
} from '../../generated/graphql';
import { useParams, Link } from 'react-router-dom';
import { TabNav, TabNavLink, Button, DatabaseLabel } from '../../ui';

export const App = () => {
  const { id: appId } = useParams<{ id: string }>();

  const [selectedDb, setSelectedDb] = useState({
    value: { name: '', id: '', type: '' },
    label: 'Please select db',
  });
  const [
    linkDatabaseMutation,
    {
      data: databaseLinkData,
      loading: databaseLinkLoading,
      error: databaseLinkError,
    },
  ] = useLinkDatabaseMutation();

  const {
    data: databaseData,
    loading: databaseDataLoading,
  } = useDatabaseQuery();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  if (!data || !databaseData) {
    return null;
  }

  // // TODO display error

  if (loading || databaseDataLoading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { databases } = databaseData;

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  const linkedDatabases = app.databases;
  const linkedIds = linkedDatabases?.map((db) => db.id);
  const notLinkedDatabases = databases.filter((db) => {
    return linkedIds?.indexOf(db.id) === -1;
  });

  const dbOptions = notLinkedDatabases.map((db) => {
    return {
      value: { name: db.name, id: db.id, type: db.type },
      label: <DatabaseLabel type={db.type} name={db.name} />,
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
          {
            query: AppByIdDocument,
            variables: { appId },
          },
        ],
      });
      setSelectedDb({
        value: { name: '', id: '', type: '' },
        label: 'Please select db',
      });
    } catch (e) {
      //TODO - REACT TOSTIFY
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
                {notLinkedDatabases.length !== 0 ? (
                  <div>
                    <Select
                      value={selectedDb}
                      onChange={setSelectedDb}
                      className="mt-3 w-80"
                      options={dbOptions}
                      placeholder={selectedDb}
                      isSearchable={false}
                      aria-labelledby="database-select-dropdown"
                      noOptionsMessage={() =>
                        'All of your databases are already linked to this app'
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
                      disabled={!selectedDb.value.id}
                      onClick={() => {
                        handleConnect(selectedDb.value.id, appId);
                      }}
                    >
                      Link database
                    </Button>
                  </div>
                ) : (
                  <React.Fragment>
                    <p className="mt-3 mb-3 text-cool-gray-400">
                      All your databases are already linked to this app! If you
                      want to create more databases proceed with create database
                      flow.
                    </p>
                    <div className="ml-80">
                      <Link to="/create-database">
                        <Button
                          color={'grey'}
                          variant="outline"
                          className="text-sm mr-3"
                        >
                          Create database
                        </Button>
                      </Link>
                    </div>
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
