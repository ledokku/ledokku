import { Avatar, Button, Input, Loading, Modal, Table, Text } from '@nextui-org/react';
import { useState } from 'react';
import { useAddAllowedUserMutation, useAllowedUsersQuery } from '../generated/graphql';
import { AdminLayout } from '../ui/layout/layout';

const Settings = () => {
    const { data, loading, refetch } = useAllowedUsersQuery();
    const [addAllowedUser, { loading: loadingAddUser }] = useAddAllowedUserMutation();
    const [showAddUser, setShowAddUser] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <AdminLayout>
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
                                <Table.Cell> </Table.Cell>
                            </Table.Row>;
                        }) ?? []}
                    </Table.Body>
                    {/* <Table.Pagination rowsPerPage={10} /> */}
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
