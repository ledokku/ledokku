import { ApolloError } from '@apollo/client';
import { Avatar, Button, Input, Loading, Modal, Table, Text } from '@nextui-org/react';
import { useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAddAllowedUserMutation, useAllowedUsersQuery, usePluginsQuery, useRemoveAllowedUserMutation } from '../generated/graphql';
import { IconButton } from '../ui/components/IconButton';
import { AdminLayout } from '../ui/layout/layout';

const Settings = () => {
    const { data, loading, refetch } = useAllowedUsersQuery();
    const [addAllowedUser, { loading: loadingAddUser }] = useAddAllowedUserMutation();
    const [removeAllowedUser] = useRemoveAllowedUserMutation();
    const [showAddUser, setShowAddUser] = useState(false);
    const [email, setEmail] = useState("");
    const { data: plugins, loading: loadingPlugins } = usePluginsQuery();
    const [pluginPage, setPluginPage] = useState(1);

    return (
        <AdminLayout loading={loading || loadingPlugins}>
            <Text h2 className="mb-8">
                Configuración
            </Text>
            <div>
                <div className='flex flex-row justify-between'>
                    <Text h3 className="mb-8">
                        Usuarios autorizados
                    </Text>
                    <Button
                        onClick={() => {
                            setShowAddUser(true)
                        }}
                    >{loadingAddUser ? <Loading /> : "Agregar usuario"}</Button>
                </div>
                <Table >
                    <Table.Header>
                        <Table.Column>Usuario</Table.Column>
                        <Table.Column>Correo electrónico</Table.Column>
                        <Table.Column> </Table.Column>
                    </Table.Header>
                    <Table.Body loadingState={loading ? "loading" : "idle"}>
                        {data?.settings.allowedEmails.map((it, index) => {
                            const user = data.settings.allowedUsers.find(it2 => it2.email === it);

                            return <Table.Row key={index}>
                                <Table.Cell>
                                    <div className='flex gap-4 items-center'>
                                        <Avatar size="sm" src={user?.avatarUrl} />
                                        {user?.username ?? "No registrado"}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>{it}</Table.Cell>
                                <Table.Cell>
                                    <IconButton
                                        onClick={() => {
                                            removeAllowedUser({
                                                variables: {
                                                    email: it
                                                }
                                            }).then(it => {
                                                refetch()
                                            }).catch((it: ApolloError) => {
                                                toast.error(it.message)
                                            })
                                        }}
                                        color='error'
                                        icon={<FaTrash />} />
                                </Table.Cell>
                            </Table.Row>;
                        }) ?? []}
                    </Table.Body>
                </Table>
                <Text h3 className="mb-8 mt-16">
                    Plugins instalados
                </Text>
                <Table key={pluginPage}>{/*  TODO: Workarround */}
                    <Table.Header>
                        <Table.Column>Nombre</Table.Column>
                        <Table.Column width={150}>Versión</Table.Column>
                    </Table.Header>
                    <Table.Body loadingState={loadingPlugins ? "loading" : "idle"}>
                        {plugins?.plugins
                            ?.slice(10 * (pluginPage - 1), (10 * (pluginPage - 1)) + 10)
                            ?.map((it) => <Table.Row key={it.name}>
                                <Table.Cell>{it.name}</Table.Cell>
                                <Table.Cell>{it.version}</Table.Cell>
                            </Table.Row>) ?? []}
                    </Table.Body>
                    <Table.Pagination
                        rowsPerPage={10}
                        page={pluginPage}
                        total={plugins?.plugins ? Math.ceil(plugins.plugins.length / 10) : undefined}
                        onPageChange={setPluginPage} />
                </Table>
            </div>
            <Modal
                closeButton
                open={showAddUser}
                blur
                onClose={() => setShowAddUser(false)}>
                <Modal.Body>
                    <form
                        className='flex flex-col items-end gap-4'
                        onSubmit={(e) => {
                            addAllowedUser({
                                variables: {
                                    email: email
                                }
                            }).then(it => {
                                refetch()
                                setShowAddUser(false)
                                setEmail("")
                            })
                            e.preventDefault()
                        }}>
                        <Input
                            fullWidth
                            label='Correo electrónico'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            type="email" />
                        <Button size="sm" type='submit'>
                            Agregar
                        </Button>
                    </form>

                </Modal.Body>
            </Modal>

        </AdminLayout>
    );
};

export default Settings;
