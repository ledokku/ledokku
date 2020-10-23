import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDatabaseQuery,
  useLinkDatabaseMutation,
  useUnlinkDatabaseMutation,
  useUnlinkDatabaseLogsSubscription,
  useLinkDatabaseLogsSubscription,
} from '../../generated/graphql';
import { useParams, Link } from 'react-router-dom';
import {
  TabNav,
  TabNavLink,
  Button,
  DatabaseLabel,
  Modal,
  ModalTitle,
  ModalDescription,
  ModalButton,
  Terminal,
} from '../../ui';
import { PostgreSQLIcon } from '../../ui/icons/PostgreSQLIcon';
import { MongoIcon } from '../../ui/icons/MongoIcon';
import { RedisIcon } from '../../ui/icons/RedisIcon';
import { MySQLIcon } from '../../ui/icons/MySQLIcon';

export const App = () => {
  const history = useHistory();
  const { id: appId } = useParams<{ id: string }>();
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [arrayOfLinkLogs, setArrayOfLinkLogs] = useState<string[]>([]);
  const [arrayOfUnlinkLogs, setArrayOfUnlinkLogs] = useState<string[]>([]);
  const [databaseAboutToUnlink, setdatabaseAboutToUnlink] = useState<string>();
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

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
  useUnlinkDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.unlinkDatabaseLogs?.[0];
      if (logsExist)
        setArrayOfUnlinkLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
    },
  });

  useLinkDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.linkDatabaseLogs?.[0];
      if (logsExist) {
        setArrayOfLinkLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
      }
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
    fetchPolicy: 'cache-and-network',
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
  // Hacky way to add create new database to link db select
  notLinkedDatabases.length > 0 &&
    notLinkedDatabases.push({ name: 'Create new database' } as any);

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
      toast.error(e.message);
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
      });
      setSelectedDb({
        value: { name: '', id: '', type: '' },
        label: 'Please select db',
      });
      setIsTerminalVisible(true);
      setLinkLoading(true);
    } catch (e) {
      toast.error(e.message);
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
                    <div className="justify-start mt-3 w-80">
                      <div className="w-full max-w-xs mx-auto">
                        <Listbox
                          as="div"
                          value={selectedDb}
                          // TODO FIX TYPES
                          // https://github.com/tailwindlabs/headlessui/issues/121
                          //@ts-ignore
                          onChange={
                            selectedDb.value.name !== 'Create new database'
                              ? setSelectedDb
                              : history.push('/create-database')
                          }
                        >
                          {({ open }) => (
                            <div className="relative z-10">
                              <span className="inline-block w-full rounded-md shadow-sm">
                                <Listbox.Button className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                  <span className="block truncate">
                                    {selectedDb.label}
                                  </span>
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                      className="h-5 w-5 text-gray-400"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      stroke="currentColor"
                                    >
                                      <path
                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                </Listbox.Button>
                              </span>

                              <Transition
                                show={open}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                              >
                                <Listbox.Options className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                                  {dbOptions.map((db) => (
                                    <Listbox.Option
                                      key={dbOptions.indexOf(db)}
                                      value={db as any}
                                    >
                                      {({ selected, active }) => (
                                        <div
                                          className={`${
                                            active
                                              ? 'text-white bg-gray-900'
                                              : 'text-gray-900'
                                          } cursor-default select-none relative py-1 pl-4 pr-4`}
                                        >
                                          <span
                                            className={`${
                                              selected
                                                ? 'font-semibold'
                                                : 'font-normal'
                                            }`}
                                          >
                                            {db.label}
                                          </span>
                                          {selected && (
                                            <span
                                              className={`${
                                                active
                                                  ? 'text-white'
                                                  : 'text-gray-600'
                                              } absolute left-0 flex items-center pl-1.5`}
                                            >
                                              <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          )}
                        </Listbox>
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
                            setIsLinkModalOpen(true);
                          }}
                        >
                          Link database
                        </Button>
                      </div>
                    </div>

                    {isLinkModalOpen && (
                      <Modal>
                        <ModalTitle>Link database</ModalTitle>
                        <ModalDescription>
                          {isTerminalVisible ? (
                            <React.Fragment>
                              <p className="mb-2 ">
                                Linking <b>{selectedDb.value.name}</b> with{' '}
                                <b>{app.name}</b>!
                              </p>
                              <Terminal className={'w-6/6'}>
                                <p className="text-green-400 mb-2">
                                  Linking process usually takes a couple of
                                  minutes. Breathe in, breathe out, logs are
                                  about to appear below:
                                </p>
                                {arrayOfLinkLogs.map((log) => (
                                  <p
                                    key={arrayOfLinkLogs.indexOf(log)}
                                    className="text-s leading-5"
                                  >
                                    {log}
                                  </p>
                                ))}
                              </Terminal>
                            </React.Fragment>
                          ) : (
                            <p>
                              Are you sure, you want to link{' '}
                              <b>{selectedDb.value.name}</b> to{' '}
                              <b>{app.name}</b>?
                            </p>
                          )}
                        </ModalDescription>
                        <ModalButton
                          ctaFn={() =>
                            handleConnect(selectedDb.value.id, appId)
                          }
                          ctaText={'Link'}
                          otherButtonText={'Cancel'}
                          isCtaLoading={isTerminalVisible ? false : linkLoading}
                          isCtaDisabled={isTerminalVisible}
                          closeModal={() => {
                            setIsLinkModalOpen(false);
                            refetch({ appId });
                            setLinkLoading(false);
                            setIsTerminalVisible(false);
                          }}
                        />
                      </Modal>
                    )}
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
                      <div
                        key={app.databases?.indexOf(database)}
                        className="flex flex-row justify-start"
                      >
                        <Link
                          to={`/database/${database.id}`}
                          className="py-2 block"
                        >
                          <div className="w-64 flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                            {database.type === 'POSTGRESQL' ? (
                              <React.Fragment>
                                <PostgreSQLIcon size={16} className="mr-1" />
                              </React.Fragment>
                            ) : undefined}
                            {database.type === 'MONGODB' ? (
                              <React.Fragment>
                                <MongoIcon size={16} className="mr-1" />
                              </React.Fragment>
                            ) : undefined}
                            {database.type === 'REDIS' ? (
                              <React.Fragment>
                                <RedisIcon size={16} className="mr-1" />
                              </React.Fragment>
                            ) : undefined}
                            {database.type === 'MYSQL' ? (
                              <React.Fragment>
                                <MySQLIcon size={16} className="mr-1" />
                              </React.Fragment>
                            ) : undefined}
                            {database.name}
                          </div>
                        </Link>
                        <Button
                          width="normal"
                          className="mt-4 ml-2 h-10"
                          color="red"
                          onClick={() => {
                            setIsUnlinkModalOpen(true);
                            setdatabaseAboutToUnlink(database.name);
                          }}
                        >
                          Unlink
                        </Button>

                        {isUnlinkModalOpen && (
                          <Modal>
                            <ModalTitle>Unlink database</ModalTitle>
                            <ModalDescription>
                              {isTerminalVisible ? (
                                <React.Fragment>
                                  <p className="mb-2 ">
                                    Unlinking <b>{app.name}</b>
                                    from <b>{databaseAboutToUnlink}</b>!
                                  </p>
                                  <Terminal className={'w-6/6'}>
                                    <p className="text-green-400 mb-2">
                                      Unlinking process usually takes a couple
                                      of minutes. Breathe in, breathe out, logs
                                      are about to appear below:
                                    </p>
                                    {arrayOfUnlinkLogs.map((log) => (
                                      <p
                                        key={arrayOfUnlinkLogs.indexOf(log)}
                                        className="text-s leading-5"
                                      >
                                        {log}
                                      </p>
                                    ))}
                                  </Terminal>
                                </React.Fragment>
                              ) : (
                                <p>
                                  Are you sure, you want to unlink{' '}
                                  <b>{app.name} </b>
                                  from <b>{databaseAboutToUnlink}</b> ?
                                </p>
                              )}
                            </ModalDescription>
                            <ModalButton
                              ctaFn={() => handleUnlink(database.id, appId)}
                              ctaText={'Unlink'}
                              otherButtonText={'Cancel'}
                              isCtaLoading={
                                isTerminalVisible ? false : unlinkLoading
                              }
                              isCtaDisabled={isTerminalVisible}
                              closeModal={() => {
                                setIsUnlinkModalOpen(false);
                                refetch({ appId });
                                setUnlinkLoading(false);
                                setIsTerminalVisible(false);
                                setdatabaseAboutToUnlink('');
                              }}
                            />
                          </Modal>
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
