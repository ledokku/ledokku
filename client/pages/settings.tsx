import { Table, Text } from '@nextui-org/react';
import { AdminLayout } from '../ui/layout/layout';

const Settings = () => {
    return (
        <AdminLayout>
            <Text h2 className="mb-8">
                Configuración
            </Text>
            <div>
                <Text h3 className="mb-8">
                    Usuarios autorizados
                </Text>
                <Table>
                    <Table.Header>
                        <Table.Column>Usuario</Table.Column>
                        <Table.Column>Correo electrónico</Table.Column>
                        <Table.Column> </Table.Column>
                    </Table.Header>
                    <Table.Body>

                    </Table.Body>
                </Table>
            </div>
        </AdminLayout>
    );
};

export default Settings;
