import { AppByIdQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import {
    Button,
    Card,
    Container,
    Grid,
    Input,
    Loading,
    Modal,
    Spacer,
    Text
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as yup from 'yup';
import {
    DashboardDocument,
    useDestroyAppMutation,
    useSetAppTagsMutation
} from '../../../../generated/graphql';
import { BranchChangeInput } from '../../../../ui/components/BranchChangeInput';
import { CodeBox } from '../../../../ui/components/CodeBox';
import { TagInput } from '../../../../ui/components/TagInput';
import { AdminLayout } from '../../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../../ui/modules/app/AppHeaderTabNav';
import { AppRebuild } from '../../../../ui/modules/app/AppRebuild';
import { AppRestart } from '../../../../ui/modules/app/AppRestart';
import { AppSettingsMenu } from '../../../../ui/modules/app/AppSettingsMenu';
import { useToast } from '../../../../ui/toast';

interface AppSettingsGeneralProps {
    app: AppByIdQuery['app'];
}

const AppSettingsAdvanced = ({ app }: AppSettingsGeneralProps) => {
    const router = useRouter();
    const toast = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [setAppTags, { loading: loadingSetTags }] = useSetAppTagsMutation();

    const [destroyAppMutation, { loading: destroyAppMutationLoading }] = useDestroyAppMutation();

    const DeleteAppNameSchema = yup.object().shape({
        appName: yup
            .string()
            .required('Requerido')
            .test(
                'Equals app name',
                'Debe ser igual al nombre de la aplicación',
                (val) => val === app.name
            ),
    });

    const formik = useFormik<{ appName: string }>({
        initialValues: {
            appName: '',
        },

        validateOnChange: true,
        validationSchema: DeleteAppNameSchema,

        onSubmit: async (values) => {
            try {
                await destroyAppMutation({
                    variables: {
                        input: { appId: app.id },
                    },
                    refetchQueries: [
                        {
                            query: DashboardDocument,
                        },
                    ],
                });
                toast.success('Aplicación eliminada');

                router.push('/dashboard');
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    const tags = app?.tags?.map(it => it.name);

    return (
        <AdminLayout pageTitle={`General | ${app?.name}`}>
            {app && <>
                <div>
                    <AppHeaderInfo app={app} />
                    <AppHeaderTabNav app={app} />
                </div>

                <Container className="mt-4">
                    <Grid.Container gap={3}>
                        <Grid xs={3}>
                            <AppSettingsMenu app={app} />
                        </Grid>
                        <Grid xs={9} direction="column">
                            <TagInput
                                tags={tags}
                                loading={loadingSetTags}
                                onAdd={(tag) => setAppTags({
                                    variables: {
                                        input: {
                                            id: app.id,
                                            tags: [...(tags ?? []), tag]
                                        }
                                    }
                                }).then(res => router.reload())}
                                onRemove={(tag) => setAppTags({
                                    variables: {
                                        input: {
                                            id: app.id,
                                            tags: (tags ?? []).filter((it) => it !== tag)
                                        }
                                    }
                                }).then(res => router.reload())} />
                            <Spacer y={2} />
                            {app.appMetaGithub && <BranchChangeInput app={app as any} />}
                            <Spacer y={2} />
                            <AppRestart app={app as any} />
                            <Spacer y={2} />
                            <AppRebuild app={app as any} />
                            <Spacer y={2} />
                            <Card className="mt-8" variant="bordered" borderWeight="normal">
                                <Card.Header>
                                    <Text h3 className="mb-1">
                                        Eliminar aplicación
                                    </Text>
                                </Card.Header>
                                <Card.Divider />
                                <Card.Body>
                                    <Text>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente
                                        la aplicación &quot;{app.name}&quot; y todo lo relacionado con
                                        ella.
                                    </Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button color="error" onClick={() => setShowDeleteModal(true)}>
                                        Eliminar aplicación
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
                                    <Text h4>Eliminar aplicación</Text>
                                </Modal.Header>
                                <Modal.Body>
                                    Escribre el nombre de la aplicación para eliminar
                                    <CodeBox>
                                        {app.name}
                                    </CodeBox>
                                    <Input
                                        css={{ marginBottom: 0 }}
                                        autoComplete="off"
                                        id="appNme"
                                        name="appName"
                                        label="Nombre de la aplicación"
                                        placeholder={app.name}
                                        value={formik.values.appName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <Text color="$error">{formik.errors.appName}</Text>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        size="sm"
                                        bordered
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        size="sm"
                                        type="submit"
                                        color="error"
                                        onClick={() => formik.handleSubmit()}
                                        disabled={
                                            !!formik.errors.appName || formik.values.appName === ''
                                        }
                                    >
                                        {destroyAppMutationLoading ? (
                                            <Loading size="sm" color="currentColor" type='points-opacity' />
                                        ) : (
                                            'Eliminar'
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Grid>
                    </Grid.Container>
                </Container>
            </>}
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    const res = await serverClient.appById({
        appId: ctx.params?.appId as string
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    });


    return {
        props: {
            app: res.app
        }
    }
}

export default AppSettingsAdvanced;
