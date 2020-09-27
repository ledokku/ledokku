import React, { useState } from 'react';
import Select from 'react-select';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDatabaseQuery,
  useLinkDatabaseMutation,
  useUnlinkDatabaseMutation,
  AppByIdDocument,
  useUnlinkDatabaseLogsSubscription,
} from '../../generated/graphql';
import { useParams, Link } from 'react-router-dom';
import {
  TabNav,
  TabNavLink,
  Button,
  DatabaseLabel,
  Modal,
  Terminal,
} from '../../ui';

export const App = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arrayOfLogs, setArrayOfLogs] = useState<string[]>([]);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState(false);

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

  const [unlinkDatabaseMutation] = useUnlinkDatabaseMutation();

  const {
    data: subscriptionData,
    // loading: subscriptionLoading,
  } = useUnlinkDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.unlinkDatabaseLogs?.[0];
      if (logsExist)
        setArrayOfLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
    },
  });

  const {
    data: databaseData,
    loading: databaseDataLoading,
  } = useDatabaseQuery();

  const { data, loading, refetch /* error */ } = useAppByIdQuery({
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

  const handleUnlink = async (databaseId: string, appId: string) => {
    try {
      await unlinkDatabaseMutation({
        variables: {
          input: {
            databaseId,
            appId,
          },
        },
      });
      setIsTerminalVisible(true);
      setUnlinkLoading(true);
    } catch (e) {
      //TODO - REACT TOSTIFY
    }
  };

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
                {!loading && app && app.databases && (
                  <React.Fragment>
                    <h2 className="mb-1 mt-3 font-semibold">
                      {app.databases.length > 0 && 'Linked databases'}
                    </h2>
                    {app.databases.map((database) => (
                      <div className="flex flex-row justify-start">
                        <Link
                          to={`/database/${database.id}`}
                          className="py-2 block"
                        >
                          <div className="w-64 flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                            {database.name}
                          </div>
                        </Link>
                        <Button
                          width="normal"
                          className="mt-4 ml-2 h-10"
                          color="red"
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                        >
                          Unlink
                        </Button>

                        {isModalOpen && (
                          <Modal
                            closeModalButton={'Close'}
                            ctaButton={`Unlink`}
                            isCtaLoading={
                              isTerminalVisible ? false : unlinkLoading
                            }
                            isCtaDisabled={isTerminalVisible}
                            mainText={
                              isTerminalVisible ? (
                                <React.Fragment>
                                  <p className="mb-2 ">
                                    Unlinking <b>{database.name}</b> from{' '}
                                    <b>{app.name}</b>!
                                  </p>
                                  <Terminal className={'-ml-13 w-6/6'}>
                                    <p className="text-green-400 mb-2">
                                      Unlinking process usually takes a couple
                                      of minutes. Breathe in, breathe out, logs
                                      are about to appear below:
                                    </p>
                                    {arrayOfLogs.map((log) => (
                                      <p className="text-s leading-5">{log}</p>
                                    ))}
                                  </Terminal>
                                </React.Fragment>
                              ) : (
                                <p>
                                  Are you sure, you want to unlink{' '}
                                  <b>{database.name}</b> from <b>{app.name}</b>?
                                </p>
                              )
                            }
                            header={'Unlink database'}
                            closeModal={() => {
                              setIsModalOpen(false);
                              refetch({ appId });
                              setUnlinkLoading(false);
                            }}
                            ctaFn={() => handleUnlink(database.id, appId)}
                            isWarningModal={true}
                          />
                        )}
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
