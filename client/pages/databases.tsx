import { Badge, Button, Link, Table, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useDatabaseQuery } from '../generated/graphql';
import { DatabaseVersionBadge } from '../ui/components/DatabaseVersionBadge';
import { AdminLayout } from '../ui/layout/layout';

const Databases = () => {
    const history = useRouter();
    const [page, setPage] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const { data, loading, error } = useDatabaseQuery({
        variables: {
            page,
            tags: tags.length > 0 ? tags : undefined,
        },
    });

    return (
        <AdminLayout error={error} pageTitle="Bases de datos">
            <div className="flex flex-row justify-between w-full">
                <Text h2 className="mb-8">
                    Bases de datos
                </Text>
                <Button
                    onClick={() => {
                        history.push('/create-database');
                    }}
                >
                    Crear base de datos
                </Button>
            </div>
            <div className='flex gap-2'>
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
            </div>
            <Table>
                <Table.Header>
                    <Table.Column>Nombre</Table.Column>
                    <Table.Column>Tipo</Table.Column>
                    <Table.Column width={300}>Etiquetas</Table.Column>
                    <Table.Column>Version</Table.Column>
                </Table.Header>
                <Table.Body loadingState={loading ? 'loading' : 'idle'}>
                    {data?.databases.items.map((it, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>
                                <Link href={`/database/${it.id}`}>
                                    <Text b h4 className='mb-0'>
                                        {it.name}
                                    </Text>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>{it.type}</Table.Cell>
                            <Table.Cell>
                                <div className='flex flex-wrap gap-2'>
                                    {it.tags.map((it, index) => <Badge
                                        key={index}
                                        enableShadow
                                        disableOutline
                                        onClick={() => {
                                            if (!tags.includes(it.name)) {
                                                setTags([...tags, it.name])
                                            }
                                        }}
                                        className="cursor-pointer"
                                        color="primary"
                                    >{it.name}</Badge>)}
                                </div>
                            </Table.Cell>
                            <Table.Cell css={{ w: '3rem' }}>
                                <DatabaseVersionBadge database={it} />
                            </Table.Cell>
                        </Table.Row>
                    )) ?? []}
                </Table.Body>
                <Table.Pagination
                    total={data?.databases.totalPages}
                    page={page + 1}
                    onPageChange={setPage}
                    rowsPerPage={10}
                />
            </Table>
        </AdminLayout>
    );
};

export default Databases;
