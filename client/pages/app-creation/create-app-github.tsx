import { AppsQuery, GithubInstallationIdQuery, RepositoriesQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Button, Checkbox, Divider, Dropdown, Grid, Input, Link, Loading, Modal, Text } from '@nextui-org/react';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import * as yup from 'yup';
import { GITHUB_APP_NAME } from '../../constants';
import {
    Branch,
    BuildEnvVar, Repository,
    useBranchesLazyQuery,
    useCreateAppGithubMutation
} from '../../generated/graphql';
import { Alert } from '../../ui/components/Alert';
import { EnvForm } from '../../ui/components/EnvForm';
import { TagInput } from '../../ui/components/TagInput';
import { AdminLayout } from '../../ui/layout/layout';
import { useToast } from '../../ui/toast';

interface RepoOption {
    value: Repository;
    label: string;
}

interface BranchOption {
    value: Branch;
    label: string;
}

interface CreateAppGithubProps {
    apps: AppsQuery['apps'];
    installationId: GithubInstallationIdQuery['githubInstallationId']["id"];
    repos: RepositoriesQuery['repositories'] | null;
}

const CreateAppGithub = ({ apps, installationId, repos }: CreateAppGithubProps) => {
    const router = useRouter();
    const toast = useToast();
    const envFile = useRef<HTMLInputElement>(null)

    const [envVars, setEnvVars] = useState<BuildEnvVar[]>([]);
    const [isNewWindowClosed, setIsNewWindowClosed] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<Repository>();
    const [selectedBranch, setSelectedBranch] = useState('');
    const [isProceedModalOpen, setIsProceedModalOpen] = useState(false);
    const [isDockerfileEnabled, setIsDockerfileEnabled] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    const [getBranches, { data: branchesData, loading: branchesLoading }] = useBranchesLazyQuery({
        fetchPolicy: 'network-only',
    });
    const [createAppGithubMutation, { loading }] = useCreateAppGithubMutation();

    const handleOpenEnvFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files?.length === 1) {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                const contents = e.target?.result as string ?? "";

                const lines = contents.split("\n");

                setEnvVars(lines.filter(it => it.includes("=")).map((line) => {
                    const values = line.split("=");
                    return {
                        key: values[0],
                        value: values.slice(1).join("=").trim()
                    };
                }))
            }

            fileReader.readAsText(files[0]);
        }
    }

    const createAppGithubSchema = yup.object().shape({
        name: yup
            .string()
            .required('Nombre de la app requerido')
            .matches(/^[a-z0-9-]+$/)
            .test(
                'El nombre ya existe',
                'El nombre de la app ya existe',
                (val) => !apps.items.find((app) => app.name === val)
            ),
        repo: yup.object({
            fullName: yup.string().required(),
            id: yup.string().required(),
            name: yup.string().required(),
        }),
        installationId: yup.string().required(),
        gitBranch: yup.string().optional(),
    });

    const formik = useFormik<{
        name: string;
        repo: {
            fullName: string;
            id: string;
            name: string;
        };
        installationId: string;
        gitBranch: string;
        dockerfilePath: string;
    }>({
        initialValues: {
            name: '',
            repo: {
                fullName: '',
                id: '',
                name: '',
            },
            installationId: '',
            gitBranch: '',
            dockerfilePath: "Dockerfile",
        },

        validateOnChange: true,
        validationSchema: createAppGithubSchema,
        onSubmit: async (values) => {
            try {
                const app = await createAppGithubMutation({
                    variables: {
                        input: {
                            name: values.name,
                            gitRepoFullName: values.repo.fullName,
                            branchName: values.gitBranch,
                            gitRepoId: values.repo.id,
                            githubInstallationId: values.installationId,
                            dockerfilePath: isDockerfileEnabled ? values.dockerfilePath : undefined,
                            envVars: envVars,
                            tags: tags.length > 0 ? tags : undefined
                        },
                    },
                });
                router.push(`/app_build/${app.data?.createAppGithub.id}`)
            } catch (error: any) {
                error.message === 'Not Found'
                    ? toast.error(`Repositorio: ${values.repo.fullName} no encontrado`)
                    : toast.error(error.message);
            }
        },
    });


    const handleOpen = () => {
        const newWindow = window.open(
            `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`,
            'Install App',
            'resizable=1, scrollbars=1, fullscreen=0, height=1000, width=1020,top=' +
            window.screen.width +
            ', left=' +
            window.screen.width +
            ', toolbar=0, menubar=0, status=0'
        );
        const timer = setInterval(async () => {
            if (newWindow && newWindow.closed) {
                setIsNewWindowClosed(true);
                clearInterval(timer);
            }
        }, 100);
    };

    useEffect(() => {
        if (isNewWindowClosed) {
            router.reload();

            setIsNewWindowClosed(false);
        }
    }, [isNewWindowClosed, setIsNewWindowClosed, router]);

    useEffect(() => {
        if (selectedRepo) {
            getBranches({
                variables: {
                    installationId,
                    repositoryName: selectedRepo.name,
                },
            });
        }
    }, [
        getBranches,
        selectedRepo?.name,
        selectedRepo,
        installationId,
    ]);

    const handleChangeRepo = (active: Repository) => {
        setSelectedRepo(active);
        setSelectedBranch('');

        const name = [...active.name]
            .map((it) => (/^[a-z0-9-]+$/.test(it) ? it : '-'))
            .join('');

        console.log(name);

        formik.setValues({
            name: name,
            installationId,
            repo: {
                fullName: active.fullName,
                name: active.name,
                id: active.id,
            },
            gitBranch: '',
            dockerfilePath: "Dockerfile"
        });
    };

    const handleChangeBranch = (active: BranchOption) => {
        setSelectedBranch(active.value.name);
        formik.setFieldValue('gitBranch', active.value.name);
    };

    let branchOptions: BranchOption[] = [];

    if (branchesData && !branchesLoading) {
        branchesData.branches.map((b) => branchOptions.push({ value: b, label: b.name }));
    }

    useEffect(() => {
        if (selectedRepo) {
            getBranches({
                variables: {
                    installationId,
                    repositoryName: selectedRepo.name,
                },
            });
        }
    }, [selectedRepo, getBranches, installationId]);

    return (
        <AdminLayout pageTitle='Crear aplicación con Github'>
            <input type='file' id='file' ref={envFile} style={{ display: 'none' }} onChange={handleOpenEnvFile} />

            <>
                <Text h2>Crear nueva aplicación de Github</Text>
                {repos ? (
                    <>
                        <Text>
                            Cuando hagas push a Git, tu aplicación va a lanzarse de nuevo
                            automaticamente.
                        </Text>

                        <Grid.Container>
                            <Grid md xs={12}>
                                <form onSubmit={formik.handleSubmit} className="mt-8">
                                    <Text h5>Repositorio</Text>
                                    <Dropdown>
                                        <Dropdown.Button flat>
                                            {selectedRepo?.fullName ??
                                                'Selecciona un repositorio'}
                                        </Dropdown.Button>
                                        <Dropdown.Menu
                                            color="primary"
                                            css={{ $$dropdownMenuWidth: 'auto' }}
                                            selectionMode="single"
                                            selectedKeys={
                                                new Set(
                                                    selectedRepo?.id ? [selectedRepo?.id] : []
                                                )
                                            }
                                            onAction={(key) => {
                                                const repo = repos.find(
                                                    (item) => item.id === key
                                                );

                                                if (repo) {
                                                    handleChangeRepo(repo);
                                                }
                                            }}
                                        >
                                            {repos.map((option) => (
                                                <Dropdown.Item key={option.id}>
                                                    {option.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Text className="mt-1" h6>
                                        ¿No puedes ver los repositorios privados?{' '}
                                        <Link
                                            onClick={() => setIsProceedModalOpen(true)}
                                            css={{ display: 'inline' }}
                                        >
                                            Configura la app de Github
                                        </Link>
                                    </Text>
                                    <div className='mt-8 mb-4'>
                                        <Input
                                            label='Nombre de la app'
                                            value={formik.values.name}
                                            onChange={(e) => {
                                                formik.setFieldValue("name", e.currentTarget.value, true);
                                            }}
                                            disabled={formik.values.repo.id.length === 0}
                                            fullWidth />
                                        <Text className='text-red-500'>
                                            {formik.errors.name}
                                        </Text>
                                    </div>
                                    <Text h5 className="mt-8">
                                        Rama a lanzar
                                    </Text>
                                    <Dropdown>
                                        <Dropdown.Button
                                            flat
                                            disabled={!branchesData}
                                        >
                                            {branchesLoading ? (
                                                <Loading color="currentColor" size="sm" />
                                            ) : selectedBranch !== '' ? (
                                                selectedBranch
                                            ) : (
                                                'Selecciona una rama'
                                            )}
                                        </Dropdown.Button>
                                        <Dropdown.Menu
                                            color="primary"
                                            css={{ $$dropdownMenuWidth: 'auto' }}
                                            selectionMode="single"
                                            selectedKeys={
                                                new Set(selectedBranch ? [selectedBranch] : [])
                                            }
                                            onAction={(key) => {
                                                const repo = branchOptions.find(
                                                    (item) => item.value.name === key
                                                );

                                                if (repo) {
                                                    handleChangeBranch(repo);
                                                }
                                            }}
                                        >
                                            {branchOptions.map((option) => (
                                                <Dropdown.Item key={option.value.name}>
                                                    {option.label}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className='mt-8 mb-4'>
                                        <Checkbox
                                            label='Usar Docker'
                                            isDisabled={formik.values.repo.id.length === 0}
                                            isSelected={isDockerfileEnabled}
                                            onChange={(val) => setIsDockerfileEnabled(val)} />

                                        {
                                            isDockerfileEnabled && <div className='mt-2'>
                                                <Input
                                                    label='Directorio del Dockerfile'
                                                    value={formik.values.dockerfilePath}
                                                    onChange={(e) => {
                                                        formik.setFieldValue("dockerfilePath", e.currentTarget.value, true);
                                                    }}
                                                    disabled={formik.values.repo.id.length === 0}
                                                    labelLeft="./"
                                                    fullWidth />
                                                <Text className='text-red-500'>
                                                    {formik.errors.dockerfilePath}
                                                </Text>
                                            </div>
                                        }
                                    </div>
                                    <TagInput
                                        tags={tags}
                                        disabled={formik.values.repo.id.length === 0}
                                        onAdd={(tag) => setTags([...tags, tag])}
                                        onRemove={(tag) => setTags(tags.filter((it) => it !== tag))} />
                                    <Button
                                        className="mt-8"
                                        type="submit"
                                        disabled={!selectedBranch || !selectedRepo}
                                    >
                                        {!loading ? 'Crear' : <Loading color="currentColor" type='points-opacity' />}
                                    </Button>
                                </form>
                            </Grid>
                            <Grid md xs={12}>
                                <div className='w-full mt-8'>
                                    <div className='flex flex-row justify-between mb-4'>
                                        <Text h5>Variables de entorno</Text>
                                        <Button size="sm" ghost onClick={() => envFile.current?.click()}>
                                            <FaUpload className='mr-2' /> Desde archivo
                                        </Button>
                                    </div>
                                    {(
                                        <div className='w-full'>
                                            <EnvForm
                                                key="newVar"
                                                name=""
                                                value=""
                                                asBuildArg={false}
                                                isNewVar={true}
                                                onSubmit={(data) => {
                                                    const exists = envVars.find(it => it.key === data.name)

                                                    if (!exists) {
                                                        setEnvVars([...envVars, {
                                                            key: data.name,
                                                            value: data.value,
                                                            asBuildArg: data.asBuildArg
                                                        }])
                                                    } else {
                                                        setEnvVars(envVars.map(it => {
                                                            if (it.key === data.name) {
                                                                return {
                                                                    key: data.name,
                                                                    value: data.value,
                                                                    asBuildArg: data.asBuildArg
                                                                }
                                                            } else {
                                                                return it
                                                            }
                                                        }))
                                                    }
                                                }} />
                                            {envVars.map((envVar, index) => {
                                                return (
                                                    <>
                                                        <Divider className='my-4' />
                                                        <EnvForm
                                                            key={envVar.key}
                                                            name={envVar.key}
                                                            value={envVar.value}
                                                            asBuildArg={envVar.asBuildArg ?? false}
                                                            onSubmit={(data) => {
                                                                setEnvVars(envVars.map(it => {
                                                                    if (it.key === data.name) {
                                                                        return {
                                                                            key: data.name,
                                                                            value: data.value,
                                                                            asBuildArg: data.asBuildArg
                                                                        }
                                                                    } else {
                                                                        return it
                                                                    }
                                                                }))
                                                            }}
                                                            onDelete={(key) => {
                                                                setEnvVars(envVars.filter(it => it.key !== key))
                                                            }}
                                                        />
                                                    </>
                                                );
                                            }).reverse()}
                                        </div>
                                    )}
                                </div>
                            </Grid>
                        </Grid.Container>
                    </>
                ) : <>
                    <Alert
                        className="my-8"
                        title="Configura los permisos de repositorios"
                        type="warning"
                        message="Primero necesitas configurar los permisos de los repositorios
                que te gustaria usar. Una vez completado,
                es hora de escoger el repositorio y la rama que te gustaria para crear la aplicación."
                    />
                    <Button onClick={() => setIsProceedModalOpen(true)}>
                        Configurar permisos
                    </Button>
                </>}
            </>

            <Modal
                blur
                closeButton
                open={isProceedModalOpen}
                onClose={() => setIsProceedModalOpen(false)}
            >
                <Modal.Header>
                    <Text h4>Configuración de Github</Text>
                </Modal.Header>
                <Modal.Body>
                    Una nueva ventana se abrirá. Después de que hayas finalizado de seleccionar los
                    repositorios, cierra esa ventana para refrescar.
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex flex-row">
                        <Button
                            bordered
                            size={'sm'}
                            className="mr-3"
                            onClick={() => setIsProceedModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            size={'sm'}
                            onClick={() => {
                                handleOpen();
                                setIsProceedModalOpen(false);
                            }}
                        >
                            Entendido
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession({ ctx });

    const apps = await serverClient.apps({
        limit: 1_000_000,
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    })

    const installation = await serverClient.githubInstallationId(undefined, {
        Authorization: `Bearer ${session?.accessToken}`
    });

    const repos = await serverClient.repositories({
        installationId: installation.githubInstallationId.id,
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    }).catch(() => null);


    return {
        props: {
            apps: apps.apps,
            installationId: installation.githubInstallationId.id,
            repos: repos?.repositories
        }
    }
}

export default CreateAppGithub;
