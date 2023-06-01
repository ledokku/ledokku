import { DatabaseByIdQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Button, Card, Input, Loading, Modal, Spacer, Text } from '@nextui-org/react';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as yup from 'yup';
import {
    DashboardDocument,
    useDestroyDatabaseMutation,
    useSetDatabaseTagsMutation
} from '../../../generated/graphql';
import { CodeBox } from '../../../ui/components/CodeBox';
import { TagInput } from '../../../ui/components/TagInput';
import { AdminLayout } from '../../../ui/layout/layout';
import { DatabaseHeaderInfo } from '../../../ui/modules/database/DatabaseHeaderInfo';
import { DatabaseHeaderTabNav } from '../../../ui/modules/database/DatabaseHeaderTabNav';
import { useToast } from '../../../ui/toast';

interface SettingsProps {
    database: DatabaseByIdQuery['database'];
}

const Settings = ({ database }: SettingsProps) => {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const toast = useToast();
    const [destroyDatabaseMutation, { loading: destroyDbLoading }] = useDestroyDatabaseMutation();
    const [setDatabaseTags, { loading: loadingSetTags }] = useSetDatabaseTagsMutation();


    const DeleteDatabaseNameSchema = yup.object().shape({
        databaseName: yup
            .string()
            .required('Requerido')
            .test(
                'Equivale al nombre de la base de datos',
                'Debe coincidir con el nombre de la base de datos',
                (val) => val === database?.name
            ),
    });

    const formik = useFormik<{ databaseName: string }>({
        initialValues: {
            databaseName: '',
        },

        validateOnChange: true,
        validationSchema: DeleteDatabaseNameSchema,

        onSubmit: async (values) => {
            try {
                await destroyDatabaseMutation({
                    variables: {
                        input: { databaseId: database?.id },
                    },
                    refetchQueries: [
                        {
                            query: DashboardDocument,
                        },
                    ],
                });
                toast.success('Base de datos eliminada');

                router.push('/dashboard');
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    const tags = database?.tags?.map(it => it.name);

    return (
        <AdminLayout pageTitle={`Registros | ${database?.name}`}>
            {database && <>
                <div>
                    <DatabaseHeaderInfo database={database} />
                    <DatabaseHeaderTabNav database={database} />
                </div>

                <div className="grid gap-4 mt-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                    <div className="mb-6 w-3/3">
                        <Spacer y={1} />
                        <TagInput
                            tags={tags}
                            loading={loadingSetTags}
                            onAdd={(tag) => setDatabaseTags({
                                variables: {
                                    input: {
                                        id: database.id,
                                        tags: [...(tags ?? []), tag]
                                    }
                                }
                            }).then(res => router.reload())}
                            onRemove={(tag) => setDatabaseTags({
                                variables: {
                                    input: {
                                        id: database.id,
                                        tags: (tags ?? []).filter((it) => it !== tag)
                                    }
                                }
                            }).then(res => router.reload())} />
                        <Spacer y={2} />
                        <Card variant="bordered" borderWeight="normal">
                            <Card.Header>
                                <Text h3 className="mb-1">
                                    Eliminar base de datos
                                </Text>
                            </Card.Header>
                            <Card.Divider />
                            <Card.Body>
                                <Text>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la
                                    base de datos &quot;{database.name}&quot; y todo lo relacionado con
                                    ella.
                                </Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button color="error" onClick={() => setShowDeleteModal(true)}>
                                    Eliminar base de datos
                                </Button>
                            </Card.Footer>
                        </Card>

                        <Modal
                            blur
                            closeButton
                            open={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                        >
                            <Modal.Header>
                                <Text h4>Eliminar base de datos</Text>
                            </Modal.Header>
                            <Modal.Body>
                                Escribre el nombre de la base de datos para eliminar
                                <CodeBox>
                                    {database.name}
                                </CodeBox>
                                <Input
                                    css={{ marginBottom: 0 }}
                                    autoComplete="off"
                                    id="databaseName"
                                    name="databaseName"
                                    label="Nombre de la base de datos"
                                    placeholder={database.name}
                                    value={formik.values.databaseName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <Text color="$error">{formik.errors.databaseName}</Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button size="sm" bordered onClick={() => setShowDeleteModal(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    color="error"
                                    onClick={() => formik.handleSubmit()}
                                    disabled={
                                        !formik.values.databaseName || !!formik.errors.databaseName
                                    }
                                >
                                    {destroyDbLoading ? (
                                        <Loading size="sm" color="currentColor" type='points-opacity' />
                                    ) : (
                                        'Eliminar'
                                    )}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </>}
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    const database = await serverClient.databaseById({
        databaseId: ctx.params?.databaseId as string
    }, {
        "Authorization": `Bearer ${session?.accessToken}`
    })


    return {
        props: {
            database: database.database,
        }
    }
}

export default Settings;
