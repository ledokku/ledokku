import {
    Button,
    Card,
    Dropdown,
    Grid,
    Link,
    Loading,
    Modal,
    Spacer,
    Table,
    Text,
} from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { TerminalOutput } from 'react-terminal-ui';
import {
    LogPayload,
    useAppByIdQuery,
    useDatabaseQuery,
    useLinkDatabaseLogsSubscription,
    useLinkDatabaseMutation,
    useUnlinkDatabaseLogsSubscription,
    useUnlinkDatabaseMutation,
} from '../../generated/graphql';
import { DatabaseLabel } from '../../ui/components/DatabaseLabel';
import { DbIcon } from '../../ui/components/DbIcon';
import { Terminal } from '../../ui/components/Terminal';
import { AdminLayout } from '../../ui/layout/layout';
import { AppHeaderInfo } from '../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../ui/modules/app/AppHeaderTabNav';
import { useToast } from '../../ui/toast';

const App = () => {
    const history = useRouter();
    const appId = history.query.appId as string;
    const toast = useToast();
    const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [arrayOfLinkLogs, setArrayOfLinkLogs] = useState<LogPayload[]>([]);
    const [arrayOfUnlinkLogs, setArrayOfUnlinkLogs] = useState<LogPayload[]>([]);
    const [databaseAboutToUnlink, setdatabaseAboutToUnlink] = useState<string>();
    const [isTerminalVisible, setIsTerminalVisible] = useState(false);
    const [processStatus, setProcessStatus] = useState<'running' | 'notStarted' | 'finished'>(
        'notStarted'
    );
    const [unlinkLoading, setUnlinkLoading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);

    const [selectedDb, setSelectedDb] = useState({
        value: { name: '', id: '', type: '' },
        label: 'Selecciona una base de datos',
    });

    const [
        linkDatabaseMutation,
        { data: databaseLinkData, loading: databaseLinkLoading, error: databaseLinkError },
    ] = useLinkDatabaseMutation();

    const [unlinkDatabaseMutation] = useUnlinkDatabaseMutation();
    useUnlinkDatabaseLogsSubscription({
        onSubscriptionData: (data) => {
            const logsExist = data.subscriptionData.data?.unlinkDatabaseLogs;
            if (logsExist) {
                setArrayOfUnlinkLogs((currentLogs) => {
                    return [...currentLogs, logsExist];
                });
                if (logsExist.type === 'end:success' || logsExist.type === 'end:failure') {
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

                if (logsExist.type === 'end:success' || logsExist.type === 'end:failure') {
                    setProcessStatus('finished');
                }
            }
        },
    });

    const { data: databaseData, loading: databaseDataLoading } = useDatabaseQuery({
        variables: {
            limit: 1_000_000,
        },
    });

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
    const notLinkedDatabases = databases.items.filter((db) => {
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
        } catch (e: any) {
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
                label: 'Selecciona una base de datos',
            });
            setIsTerminalVisible(true);
            setLinkLoading(true);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <AdminLayout>
            <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>
            <Grid.Container gap={4}>
                <Grid xs={12} md={6} className="flex flex-col">
                    <Text h3 className="mb-8">
                        Información de la aplicación
                    </Text>
                    <Table>
                        <Table.Header>
                            <Table.Column> </Table.Column>
                            <Table.Column>VALOR</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Nombre</Table.Cell>
                                <Table.Cell>{app.name}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Identificador</Table.Cell>
                                <Table.Cell>{app.id}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Creado el</Table.Cell>
                                <Table.Cell>
                                    {new Date(app.createdAt).toLocaleString('es', {
                                        dateStyle: 'full',
                                        timeStyle: 'long',
                                    })}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Grid>
                <Grid xs={12} md={6} className="flex flex-col">
                    <Text h3 className="mb-8">
                        Bases de datos conectadas
                    </Text>
                    {databases.items.length === 0 ? (
                        <>
                            <div className="mt-4 mb-4">
                                <Text className="text-gray-400">
                                    Actualmente no has creado bases de datos, para hacerlo haz el
                                    procesos de creación de bases de datos.
                                </Text>
                            </div>
                            <Link href="/create-database/">
                                <Button>Crear una base de datos</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {notLinkedDatabases.length !== 0 ? (
                                <div>
                                    <Dropdown>
                                        <Dropdown.Button flat>{selectedDb.label}</Dropdown.Button>
                                        <Dropdown.Menu
                                            selectionMode="single"
                                            selectedKeys={new Set([selectedDb.value.id])}
                                            onAction={(key) => {
                                                const db = dbOptions.find(
                                                    (option) => option.value.id === key
                                                );

                                                if (key === 'create-new-database-internal-id') {
                                                    history.push({
                                                        pathname: '/create-database',
                                                    });
                                                } else if (db) {
                                                    setSelectedDb({
                                                        label: db.value.name,
                                                        value: db.value,
                                                    });
                                                }
                                            }}
                                            color="primary"
                                        >
                                            <Dropdown.Section>
                                                {dbOptions.map((database) => (
                                                    <Dropdown.Item key={database.value.id}>
                                                        {database.label}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Section>
                                            <Dropdown.Section>
                                                <Dropdown.Item key="create-new-database-internal-id">
                                                    Crear base de datos nueva
                                                </Dropdown.Item>
                                            </Dropdown.Section>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {databaseLinkError && (
                                        <Text color="$error">
                                            {databaseLinkError.graphQLErrors[0].message}
                                        </Text>
                                    )}

                                    <Button
                                        className="mt-4"
                                        disabled={!selectedDb.value.id || linkLoading}
                                        onClick={() => {
                                            setIsLinkModalOpen(true);
                                        }}
                                    >
                                        {databaseLinkLoading &&
                                        !databaseLinkData &&
                                        !databaseLinkError ? (
                                            <Loading color="currentColor" />
                                        ) : (
                                            'Enlazar base de datos'
                                        )}
                                    </Button>

                                    <Modal
                                        preventClose={processStatus === 'running'}
                                        width={isTerminalVisible ? '70%' : undefined}
                                        open={isLinkModalOpen}
                                        closeButton
                                        blur
                                        onClose={() => {
                                            setIsLinkModalOpen(false);
                                            refetch({ appId });
                                            setLinkLoading(false);
                                            setIsTerminalVisible(false);
                                            setProcessStatus('notStarted');
                                        }}
                                    >
                                        <Modal.Header>
                                            <Text h4>Enlazar base de datos</Text>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {isTerminalVisible ? (
                                                <>
                                                    <Text className="mb-2 ">
                                                        ¡Enlazando base de datos{' '}
                                                        <b>{selectedDb.value.name}</b> con{' '}
                                                        <b>{app.name}</b>!
                                                    </Text>
                                                    <Text>
                                                        El proceso de enlace usualmente tarda unos
                                                        minutos. Respira un poco, los registros
                                                        aparecerán pronto:
                                                    </Text>
                                                    <Terminal className={'w-6/6'}>
                                                        {arrayOfLinkLogs.map((log) => (
                                                            <TerminalOutput
                                                                key={arrayOfLinkLogs.indexOf(log)}
                                                            >
                                                                {log.message}
                                                            </TerminalOutput>
                                                        ))}
                                                    </Terminal>
                                                </>
                                            ) : (
                                                <p>
                                                    ¿Estás seguro de enlazar la base de datos{' '}
                                                    <b>{selectedDb.value.name}</b> con{' '}
                                                    <b>{app.name}</b>?
                                                </p>
                                            )}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                disabled={processStatus === 'running'}
                                                size="sm"
                                                color="error"
                                                bordered
                                                onClick={() => {
                                                    setIsLinkModalOpen(false);
                                                    refetch({ appId });
                                                    setLinkLoading(false);
                                                    setIsTerminalVisible(false);
                                                    setProcessStatus('notStarted');
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                size="sm"
                                                type="submit"
                                                onClick={() => {
                                                    setProcessStatus('running');
                                                    handleConnect(selectedDb.value.id, appId);
                                                }}
                                                disabled={isTerminalVisible}
                                            >
                                                {(isTerminalVisible ? false : linkLoading) ? (
                                                    <Loading size="sm" color="currentColor" />
                                                ) : (
                                                    'Enlazar'
                                                )}
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            ) : (
                                <>
                                    <Text>
                                        Todas las bases de datos ya están enlazadas con esta
                                        aplicación. Si quieres crear más bases de datos inicia el
                                        proceso de creación de bases de datos.
                                    </Text>
                                    <div className="mt-4">
                                        <Link href="/create-database">
                                            <Button bordered className="text-sm mr-3">
                                                Crear base de datos
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                            {!loading && app && app.databases && (
                                <>
                                    <Text h3 className="mt-8 mb-4">
                                        {app.databases.length > 0 && 'Bases de datos enlazadas'}
                                    </Text>
                                    <div className="flex flex-col">
                                        {app.databases.map((database, index) => {
                                            return (
                                                <div key={index}>
                                                    <Card variant="bordered">
                                                        <Card.Body>
                                                            <div className="flex flex-row items-center">
                                                                <DbIcon
                                                                    database={database.type}
                                                                    size={24}
                                                                />
                                                                <Text
                                                                    className="mx-4 text-lg"
                                                                    b
                                                                    css={{ flexGrow: 1 }}
                                                                >
                                                                    {database.name}
                                                                </Text>
                                                                <Link
                                                                    href={`/database/${database.id}`}
                                                                >
                                                                    <Button
                                                                        className="mr-2"
                                                                        css={{
                                                                            minWidth: 'fit-content',
                                                                        }}
                                                                        color="primary"
                                                                        size="sm"
                                                                        icon={<FiInfo size={16} />}
                                                                    />
                                                                </Link>
                                                                <Button
                                                                    color="error"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setIsUnlinkModalOpen(true);
                                                                        setdatabaseAboutToUnlink(
                                                                            database.name
                                                                        );
                                                                    }}
                                                                >
                                                                    Desenlazar
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>

                                                    <Modal
                                                        preventClose={processStatus === 'running'}
                                                        width={
                                                            isTerminalVisible ? '70%' : undefined
                                                        }
                                                        open={isUnlinkModalOpen}
                                                        closeButton
                                                        blur
                                                        onClose={() => {
                                                            setIsUnlinkModalOpen(false);
                                                            refetch({ appId });
                                                            setUnlinkLoading(false);
                                                            setIsTerminalVisible(false);
                                                            setdatabaseAboutToUnlink('');
                                                            setProcessStatus('notStarted');
                                                        }}
                                                    >
                                                        <Modal.Header>
                                                            <Text h4>Desenlazar base de datos</Text>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            {isTerminalVisible ? (
                                                                <>
                                                                    <p className="mb-2 ">
                                                                        ¡Desenlazando{' '}
                                                                        <b>{app.name}</b> de{' '}
                                                                        <b>
                                                                            {databaseAboutToUnlink}
                                                                        </b>
                                                                        !
                                                                    </p>
                                                                    <p className="text-gray-500 mb-2">
                                                                        El proceso de desenlace
                                                                        usualmente tarda unos
                                                                        minutos. Respira un poco,
                                                                        los registros apareceran
                                                                        pronto:
                                                                    </p>
                                                                    <Terminal className={'w-6/6'}>
                                                                        {arrayOfUnlinkLogs.map(
                                                                            (log) => (
                                                                                <TerminalOutput
                                                                                    key={arrayOfUnlinkLogs.indexOf(
                                                                                        log
                                                                                    )}
                                                                                >
                                                                                    {log.message}
                                                                                </TerminalOutput>
                                                                            )
                                                                        )}
                                                                    </Terminal>
                                                                </>
                                                            ) : (
                                                                <p>
                                                                    ¿Estás seguro de desenlazar{' '}
                                                                    <b>{app.name}</b> de{' '}
                                                                    <b>{databaseAboutToUnlink}</b>?
                                                                </p>
                                                            )}
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button
                                                                disabled={
                                                                    processStatus === 'running'
                                                                }
                                                                size="sm"
                                                                bordered
                                                                onClick={() => {
                                                                    setIsUnlinkModalOpen(false);
                                                                    refetch({ appId });
                                                                    setUnlinkLoading(false);
                                                                    setIsTerminalVisible(false);
                                                                    setdatabaseAboutToUnlink('');
                                                                    setProcessStatus('notStarted');
                                                                }}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                type="submit"
                                                                color="error"
                                                                onClick={() => {
                                                                    setProcessStatus('running');
                                                                    handleUnlink(
                                                                        database.id,
                                                                        appId
                                                                    );
                                                                }}
                                                                disabled={isTerminalVisible}
                                                            >
                                                                {(
                                                                    isTerminalVisible
                                                                        ? false
                                                                        : unlinkLoading
                                                                ) ? (
                                                                    <Loading
                                                                        size="sm"
                                                                        color="currentColor"
                                                                    />
                                                                ) : (
                                                                    'Desenlazar'
                                                                )}
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>

                                                    <Spacer />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </Grid>
            </Grid.Container>
        </AdminLayout>
    );
};

export default App;
