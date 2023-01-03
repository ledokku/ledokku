import { Badge, Button, Link, Table, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppsQuery } from '../generated/graphql';
import { AdminLayout } from '../ui/layout/layout';

const Apps = () => {
    const history = useRouter();
    const [page, setPage] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const { data, loading, error } = useAppsQuery({
        variables: {
            page,
            tags: tags.length > 0 ? tags : undefined,
        },
    });

    return (
        <AdminLayout error={error} pageTitle="Aplicaciones">
            <div className="flex flex-row justify-between w-full">
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
            {tags.map((it, index) => <Badge
                key={index}
                enableShadow
                disableOutline
                color="primary"
            >{it}<AiOutlineCloseCircle
                    className="ml-1 cursor-pointer"
                    onClick={() => {
                        setTags(tags.filter(it2 => it2 !== it))
                    }} /></Badge>)}
            <Table>
                <Table.Header>
                    <Table.Column>Nombre</Table.Column>
                    <Table.Column>Repositorio</Table.Column>
                    <Table.Column width={300}>Etiquetas</Table.Column>
                    <Table.Column>Status</Table.Column>
                </Table.Header>
                <Table.Body loadingState={loading ? 'loading' : 'idle'}>
                    {data?.apps.items.map((it, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>
                                <Link href={`/app/${it.id}`}>
                                    <Text b h4 className='mb-0'>
                                        {it.name}
                                    </Text>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                {it.appMetaGithub
                                    ? `${it.appMetaGithub.repoOwner}/${it.appMetaGithub.repoName}`
                                    : ' '}
                            </Table.Cell>
                            <Table.Cell>
                                <div className='flex flex-wrap gap-2'>
                                    {it.tags.map((it, index) => <Badge
                                        key={index}
                                        enableShadow
                                        onClick={() => {
                                            if (!tags.includes(it.name)) {
                                                setTags([...tags, it.name])
                                            }
                                        }}
                                        className="cursor-pointer"
                                        disableOutline
                                        color="primary"
                                    >{it.name}</Badge>)}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                {it.status}
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
