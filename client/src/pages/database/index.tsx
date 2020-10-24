import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Listbox, Transition } from '@headlessui/react';
import { Header } from '../../modules/layout/Header';
import {
  useDatabaseByIdQuery,
  useAppsQuery,
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
  Modal,
  ModalTitle,
  ModalDescription,
  ModalButton,
  Terminal,
} from '../../ui';

export const Database = () => {
  const { id: databaseId } = useParams<{ id: string }>();
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [arrayOfUnlinkLogs, setArrayOfUnlinkLogs] = useState<string[]>([]);
  const [arrayOfLinkLogs, setArrayOfLinkLogs] = useState<string[]>([]);
  const [appAboutToUnlink, setAppAboutToUnlink] = useState<string>();
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

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

  const { data, loading, refetch /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
  });

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

  if (!data || !appsData) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { database } = data;
  const { apps } = appsData;

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

  if (!database) {
    // TODO nice 404
    return <p>Database not found.</p>;
  }

  const linkedApps = database.apps;
  const linkedIds = linkedApps?.map((db) => db.id);
  const notLinkedApps = apps.filter((db) => {
    return linkedIds?.indexOf(db.id) === -1;
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
      });
      setSelectedApp({
        value: { name: '', id: '' },
        label: 'Please select an app',
      });
      setIsTerminalVisible(true);
      setLinkLoading(true);
      // TODO - REACT - TOASTIFY
    } catch (e) {
      toast.error(e.message);
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
                    <Listbox
                      as="div"
                      value={selectedApp}
                      //@ts-ignore
                      onChange={setSelectedApp}
                    >
                      {({ open }) => (
                        <React.Fragment>
                          <Listbox.Button className="pl-1.5 py-1.5 flex flex-start justify-between mt-3 w-80 rounded-md shadow-sm border border-gray-300">
                            {selectedApp.label}
                            <svg
                              className="mt-1 h-5 w-5 text-gray-400"
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
                            >
                              <Listbox.Options className="bg-white absolute mt-2 w-80">
                                {appOptions.map(
                                  (app) =>
                                    app.value.id !== selectedApp.value.id && (
                                      <Listbox.Option
                                        className="py-2 block"
                                        key={appOptions.indexOf(app)}
                                        value={app as any}
                                      >
                                        {({ active }) => (
                                          <p
                                            className={`${
                                              active
                                                ? 'bg-gray-200 pl-2  py-1'
                                                : 'bg-white text-black pl-2 py-1'
                                            }`}
                                          >
                                            {app.label}
                                          </p>
                                        )}
                                      </Listbox.Option>
                                    )
                                )}
                              </Listbox.Options>
                            </Transition>
                          )}
                        </React.Fragment>
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
                      isDisabledBelowDropdown={true}
                      isLoading={
                        databaseLinkLoading &&
                        !databaseLinkData &&
                        !databaseLinkError
                      }
                      disabled={!selectedApp.value.id}
                      onClick={() => setIsLinkModalOpen(true)}
                    >
                      Link app
                    </Button>
                    {isLinkModalOpen && (
                      <Modal>
                        <ModalTitle>Link app</ModalTitle>
                        <ModalDescription>
                          {isTerminalVisible ? (
                            <React.Fragment>
                              <p className="mb-2 ">
                                Linking <b>{selectedApp.value.name}</b> with{' '}
                                <b>{database.name}</b>!
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
                              <b>{selectedApp.value.name}</b> to{' '}
                              <b>{database.name}</b>?
                            </p>
                          )}
                        </ModalDescription>
                        <ModalButton
                          ctaFn={() =>
                            handleConnect(databaseId, selectedApp.value.id)
                          }
                          ctaText={'Link'}
                          otherButtonText={'Cancel'}
                          isCtaLoading={isTerminalVisible ? false : linkLoading}
                          isCtaDisabled={isTerminalVisible}
                          closeModal={() => {
                            setIsLinkModalOpen(false);
                            refetch({ databaseId });
                            setLinkLoading(false);
                            setIsTerminalVisible(false);
                          }}
                        />
                      </Modal>
                    )}
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
                      <div
                        key={database.apps?.indexOf(app)}
                        className="flex flex-row justify-start"
                      >
                        <Link to={`/app/${app.id}`} className="py-2 block">
                          <div className="w-64 flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                            {app.name}
                          </div>
                        </Link>
                        <Button
                          width="normal"
                          className="mt-4 ml-2 h-10"
                          color="red"
                          onClick={() => {
                            setIsUnlinkModalOpen(true);
                            setAppAboutToUnlink(app.name);
                          }}
                        >
                          Unlink
                        </Button>

                        {isUnlinkModalOpen && (
                          <Modal>
                            <ModalTitle>Unlink app</ModalTitle>
                            <ModalDescription>
                              {isTerminalVisible ? (
                                <React.Fragment>
                                  <p className="mb-2 ">
                                    Unlinking <b>{database.name}</b> from{' '}
                                    <b>{appAboutToUnlink}</b>!
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
                                  <b>{database.name}</b> from{' '}
                                  <b>{appAboutToUnlink}</b>?
                                </p>
                              )}
                            </ModalDescription>
                            <ModalButton
                              ctaFn={() => handleUnlink(database.id, app.id)}
                              ctaText={'Unlink'}
                              otherButtonText={'Cancel'}
                              isCtaLoading={
                                isTerminalVisible ? false : unlinkLoading
                              }
                              isCtaDisabled={isTerminalVisible}
                              closeModal={() => {
                                setIsUnlinkModalOpen(false);
                                refetch({ databaseId });
                                setUnlinkLoading(false);
                                setIsTerminalVisible(false);
                                setAppAboutToUnlink('');
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
