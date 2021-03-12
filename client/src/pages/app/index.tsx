import { useState } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react';
import cx from 'classnames';
import { Container, Heading, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDatabaseQuery,
  useLinkDatabaseMutation,
  useUnlinkDatabaseMutation,
  useUnlinkDatabaseLogsSubscription,
  useLinkDatabaseLogsSubscription,
  RealTimeLog,
} from '../../generated/graphql';

import {
  Button,
  DatabaseLabel,
  Modal,
  ModalTitle,
  ModalDescription,
  ModalButton,
  Terminal,
  HeaderContainer,
} from '../../ui';
import { PostgreSQLIcon } from '../../ui/icons/PostgreSQLIcon';
import { MongoIcon } from '../../ui/icons/MongoIcon';
import { RedisIcon } from '../../ui/icons/RedisIcon';
import { MySQLIcon } from '../../ui/icons/MySQLIcon';
import { useToast } from '../../ui/toast';
import { AppHeaderTabNav } from '../../modules/app/AppHeaderTabNav';

export const App = () => {
  const history = useHistory();
  const toast = useToast();
  const { id: appId } = useParams<{ id: string }>();
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [arrayOfLinkLogs, setArrayOfLinkLogs] = useState<RealTimeLog[]>([]);
  const [arrayOfUnlinkLogs, setArrayOfUnlinkLogs] = useState<RealTimeLog[]>([]);
  const [databaseAboutToUnlink, setdatabaseAboutToUnlink] = useState<string>();
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [processStatus, setProcessStatus] = useState<
    'running' | 'notStarted' | 'finished'
  >('notStarted');
  const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  const [selectedDb, setSelectedDb] = useState({
    value: { name: '', id: '', type: '' },
    label: 'Please select database',
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
      const logsExist = data.subscriptionData.data?.unlinkDatabaseLogs;
      if (logsExist) {
        setArrayOfUnlinkLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (
          logsExist.type === 'end:success' ||
          logsExist.type === 'end:failure'
        ) {
          setProcessStatus('finished');
        }
      }
    },
  });

  useLinkDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.linkDatabaseLogs;
      if (logsExist) {
        setArrayOfLinkLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });

        if (
          logsExist.type === 'end:success' ||
          logsExist.type === 'end:failure'
        ) {
          setProcessStatus('finished');
        }
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
        label: 'Please select database',
      });
      setIsTerminalVisible(true);
      setLinkLoading(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <HeaderContainer>
        <Header />
        <AppHeaderTabNav app={app} />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <div>
            <Heading as="h2" size="md" py={5}>
              App info
            </Heading>
            <div className="bg-gray-100 shadow overflow-hidden rounded-lg border-b border-gray-200">
              <Table mt="4" mb="4" variant="simple">
                <Tbody mt="10">
                  <Tr py="4">
                    <Td className="font-semibold" py="3" px="4">
                      App name
                    </Td>
                    <Td py="3" px="4">
                      {app.name}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="font-semibold" py="7" px="4">
                      id
                    </Td>
                    <Td w="1/3" py="3" px="4">
                      {app.id}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="font-semibold" py="3" px="4">
                      Created at
                    </Td>
                    <Td py="3" px="4">
                      {app.createdAt}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </div>

          <div className="w-full">
            <Heading as="h2" size="md" py={5}>
              Databases
            </Heading>
            {databases.length === 0 ? (
              <>
                <div className="mt-4 mb-4">
                  <h2 className="text-gray-400">
                    Currently you haven't created any databases, to do so
                    proceed with the database creation flow
                  </h2>
                </div>
                <Link
                  to={{
                    pathname: '/create-database/',
                    state: app.name,
                  }}
                >
                  <Button width="large" color={'grey'}>
                    Create a database
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {notLinkedDatabases.length !== 0 ? (
                  <div>
                    <Listbox
                      as="div"
                      value={selectedDb}
                      //@ts-ignore
                      onChange={
                        selectedDb.value.name !== 'Create new database'
                          ? setSelectedDb
                          : history.push({
                              pathname: '/create-database',
                              state: app.name,
                            })
                      }
                    >
                      {({ open }) => (
                        <div className="relative w-80">
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
                          {open && (
                            <Transition
                              show={open}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                              className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10"
                            >
                              <Listbox.Options
                                static
                                className="max-h-60 rounded-md py-1 text-base leading-6 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                              >
                                {dbOptions.map(
                                  (db) =>
                                    db.value.id !== selectedDb.value.id && (
                                      <Listbox.Option
                                        key={dbOptions.indexOf(db)}
                                        value={db as any}
                                      >
                                        {({ active }) => (
                                          <div
                                            className={cx(
                                              'cursor-default select-none relative py-2 px-4',
                                              {
                                                'bg-gray-200': active,
                                                'bg-white text-black': !active,
                                              }
                                            )}
                                          >
                                            {db.label}
                                          </div>
                                        )}
                                      </Listbox.Option>
                                    )
                                )}
                              </Listbox.Options>
                            </Transition>
                          )}
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
                      disabled={!selectedDb.value.id || linkLoading}
                      onClick={() => {
                        setIsLinkModalOpen(true);
                      }}
                    >
                      Link database
                    </Button>
                    {isLinkModalOpen && (
                      <Modal>
                        <ModalTitle>Link database</ModalTitle>
                        <ModalDescription>
                          {isTerminalVisible ? (
                            <>
                              <p className="mb-2 ">
                                Linking <b>{selectedDb.value.name}</b> with{' '}
                                <b>{app.name}</b>!
                              </p>
                              <p className="text-gray-500 mb-2">
                                Linking process usually takes a couple of
                                minutes. Breathe in, breathe out, logs are about
                                to appear below:
                              </p>
                              <Terminal className={'w-6/6'}>
                                {arrayOfLinkLogs.map((log) => (
                                  <p
                                    key={arrayOfLinkLogs.indexOf(log)}
                                    className="text-s leading-5"
                                  >
                                    {log.message}
                                  </p>
                                ))}
                              </Terminal>
                            </>
                          ) : (
                            <p>
                              Are you sure, you want to link{' '}
                              <b>{selectedDb.value.name}</b> to{' '}
                              <b>{app.name}</b>?
                            </p>
                          )}
                        </ModalDescription>
                        <ModalButton
                          ctaFn={() => {
                            setProcessStatus('running');
                            handleConnect(selectedDb.value.id, appId);
                          }}
                          ctaText={'Link'}
                          otherButtonText={'Cancel'}
                          isCtaLoading={isTerminalVisible ? false : linkLoading}
                          isCtaDisabled={isTerminalVisible}
                          isOtherButtonDisabled={processStatus === 'running'}
                          closeModal={() => {
                            setIsLinkModalOpen(false);
                            refetch({ appId });
                            setLinkLoading(false);
                            setIsTerminalVisible(false);
                            setProcessStatus('notStarted');
                          }}
                        />
                      </Modal>
                    )}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
                {!loading && app && app.databases && (
                  <>
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
                              <>
                                <PostgreSQLIcon size={16} className="mr-1" />
                              </>
                            ) : undefined}
                            {database.type === 'MONGODB' ? (
                              <>
                                <MongoIcon size={16} className="mr-1" />
                              </>
                            ) : undefined}
                            {database.type === 'REDIS' ? (
                              <>
                                <RedisIcon size={16} className="mr-1" />
                              </>
                            ) : undefined}
                            {database.type === 'MYSQL' ? (
                              <>
                                <MySQLIcon size={16} className="mr-1" />
                              </>
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
                                <>
                                  <p className="mb-2 ">
                                    Unlinking <b>{app.name}</b>
                                    from <b>{databaseAboutToUnlink}</b>!
                                  </p>
                                  <p className="text-gray-500 mb-2">
                                    Unlinking process usually takes a couple of
                                    minutes. Breathe in, breathe out, logs are
                                    about to appear below:
                                  </p>
                                  <Terminal className={'w-6/6'}>
                                    {arrayOfUnlinkLogs.map((log) => (
                                      <p
                                        key={arrayOfUnlinkLogs.indexOf(log)}
                                        className="text-s leading-5"
                                      >
                                        {log.message}
                                      </p>
                                    ))}
                                  </Terminal>
                                </>
                              ) : (
                                <p>
                                  Are you sure, you want to unlink{' '}
                                  <b>{app.name} </b>
                                  from <b>{databaseAboutToUnlink}</b> ?
                                </p>
                              )}
                            </ModalDescription>
                            <ModalButton
                              ctaFn={() => {
                                setProcessStatus('running');
                                handleUnlink(database.id, appId);
                              }}
                              ctaText={'Unlink'}
                              otherButtonText={'Cancel'}
                              isOtherButtonDisabled={
                                processStatus === 'running'
                              }
                              isCtaLoading={
                                isTerminalVisible ? false : unlinkLoading
                              }
                              isCtaDisabled={isTerminalVisible === true}
                              closeModal={() => {
                                setIsUnlinkModalOpen(false);
                                refetch({ appId });
                                setUnlinkLoading(false);
                                setIsTerminalVisible(false);
                                setdatabaseAboutToUnlink('');
                                setProcessStatus('notStarted');
                              }}
                            />
                          </Modal>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
