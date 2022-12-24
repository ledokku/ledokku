import { Button, Table, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppsQuery } from '../generated/graphql';
import { AdminLayout } from '../ui/layout/layout';

const Apps = () => {
    const history = useRouter();
    const [page, setPage] = useState(0);
    const { data, loading, error } = useAppsQuery({
        variables: {
            page,
        },
    });

    return (
        <AdminLayout error={error}>
            <div className="w-full flex flex-row justify-between">
                <Text h2 className="mb-8">
                    Aplicaciones
                </Text>
                <Button
                    onClick={() => {
                        history.push('/app-creation/create-app');
                    }}
                >
                    Crear aplicación
                </Button>
            </div>
            <Table
                selectionMode="single"
                onSelectionChange={(key: any) => {
                    const index = key.currentKey;

                    history.push(`app/${data?.apps.items[index].id}`);
                }}
            >
                <Table.Header>
                    <Table.Column>Nombre</Table.Column>
                    <Table.Column>Repositorio</Table.Column>
                    <Table.Column>Status</Table.Column>
                </Table.Header>
                <Table.Body loadingState={loading ? 'loading' : 'idle'}>
                    {data?.apps.items.map((it, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>
                                <Text b h4>
                                    {it.name}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                {it.appMetaGithub
                                    ? `${it.appMetaGithub.repoOwner}/${it.appMetaGithub.repoName}`
                                    : ' '}
                            </Table.Cell>
                            <Table.Cell>
                                {it.type}
                            </Table.Cell>
                        </Table.Row>
                    )) ?? []}
                </Table.Body>
                <Table.Pagination
                    total={data?.apps.totalPages}
                    page={page + 1}
                    onPageChange={setPage}
                    rowsPerPage={10}
                />
            </Table>
        </AdminLayout>
    );
};

export default Apps;
