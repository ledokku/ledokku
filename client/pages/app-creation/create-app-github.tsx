import { Button, Checkbox, Divider, Dropdown, Grid, Input, Link, Loading, Modal, Text } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import * as yup from 'yup';
import { GITHUB_APP_NAME } from '../../constants';
import {
    Branch,
    BuildEnvVar, Repository, useAppsQuery,
    useBranchesLazyQuery,
    useCreateAppGithubMutation,
    useGithubInstallationIdQuery,
    useRepositoriesLazyQuery
} from '../../generated/graphql';
import { Alert } from '../../ui/components/Alert';
import { EnvForm } from '../../ui/components/EnvForm';
import { LoadingSection } from '../../ui/components/LoadingSection';
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

const CreateAppGithub = () => {
    const router = useRouter();
    const toast = useToast();
    const envFile = useRef<HTMLInputElement>(null)

    const { data: dataApps } = useAppsQuery({
        variables: {
            limit: 1_000_000,
        },
    });
    const [envVars, setEnvVars] = useState<BuildEnvVar[]>([]);
    const [isNewWindowClosed, setIsNewWindowClosed] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<Repository>();
    const [selectedBranch, setSelectedBranch] = useState('');
    const [isProceedModalOpen, setIsProceedModalOpen] = useState(false);
    const [isDockerfileEnabled, setIsDockerfileEnabled] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const { data: installationData, loading: installationLoading } = useGithubInstallationIdQuery({
        fetchPolicy: 'network-only',
    });
    const [getRepos, { data: reposData, loading: reposLoading }] = useRepositoriesLazyQuery({
        fetchPolicy: 'network-only',
    });

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
                (val) => !dataApps?.apps.items.find((app) => app.name === val)
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
            if (installationData) {
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
        if (!installationLoading && installationData && isNewWindowClosed) {
            getRepos({
                variables: {
                    installationId: installationData.githubInstallationId.id,
                },
            });

            setIsNewWindowClosed(false);
        }
    }, [installationData, installationLoading, isNewWindowClosed, setIsNewWindowClosed, getRepos]);

    useEffect(() => {
        if (
            !installationLoading &&
            installationData &&
            !reposLoading &&
            reposData &&
            selectedRepo
        ) {
            getBranches({
                variables: {
                    installationId: installationData.githubInstallationId.id,
                    repositoryName: selectedRepo.name,
                },
            });
        }
    }, [
        installationData,
        installationLoading,
        reposData,
        reposLoading,
        getBranches,
        selectedRepo?.name,
        selectedRepo,
    ]);

    const handleChangeRepo = (active: RepoOption) => {
        setSelectedRepo(active.value);
        setSelectedBranch('');
        if (installationData) {
            const name = [...active.value.name]
                .map((it) => (/^[a-z0-9-]+$/.test(it) ? it : '-'))
                .join('');

            console.log(name);

            formik.setValues({
                name: name,
                installationId: installationData?.githubInstallationId.id,
                repo: {
                    fullName: active.value.fullName,
                    name: active.value.name,
                    id: active.value.id,
                },
                gitBranch: '',
                dockerfilePath: "Dockerfile"
            });
        }
    };

    const handleChangeBranch = (active: BranchOption) => {
        setSelectedBranch(active.value.name);
        formik.setFieldValue('gitBranch', active.value.name);
    };

    const repoOptions: RepoOption[] = [];

    if (reposData && !reposLoading) {
        reposData?.repositories.map((r) => repoOptions.push({ value: r, label: r.fullName }));
    }

    let branchOptions: BranchOption[] = [];

    if (branchesData && !branchesLoading) {
        branchesData.branches.map((b) => branchOptions.push({ value: b, label: b.name }));
    }

    useEffect(() => {
        if (installationData && !installationLoading) {
            getRepos({
                variables: {
                    installationId: installationData?.githubInstallationId.id,
                },
            });
        }
    }, [installationLoading, getRepos, installationData]);

    useEffect(() => {
        if (selectedRepo && installationData) {
            getBranches({
                variables: {
                    installationId: installationData?.githubInstallationId.id,
                    repositoryName: selectedRepo.name,
                },
            });
        }
    }, [selectedRepo, getBranches, installationData]);

    return (
        <AdminLayout pageTitle='Crear aplicación con Github'>
            <input type='file' id='file' ref={envFile} style={{ display: 'none' }} onChange={handleOpenEnvFile} />

            <>
                <Text h2>Crear nueva aplicación de Github</Text>
                {installationData && !installationLoading && reposData && !reposLoading ? (
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
                                                const repo = repoOptions.find(
                                                    (item) => item.value.id === key
                                                );

                                                if (repo) {
                                                    handleChangeRepo(repo);
                                                }
                                            }}
                                        >
                                            {repoOptions.map((option) => (
                                                <Dropdown.Item key={option.value.id}>
                                                    {option.label}
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
                                            disabled={
                                                !branchesData ||
                                                branchesLoading ||
                                                reposLoading ||
                                                !reposData
                                            }
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
                                    <div className='flex flex-row justify-between'>
                                        <Text h5>Variables de entorno</Text>
                                        <Button size="sm" ghost onClick={() => envFile.current?.click()}>
                                            <FaUpload className='mr-2' /> Desde archivo
                                        </Button>
                                    </div>
                                    {(
                                        <div className='w-full'>
                                            {envVars.map((envVar, index) => {
                                                return (
                                                    <div key={index}>
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
                                                        <div className="my-8">
                                                            <Divider />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <EnvForm
                                                key="newVar"
                                                name=""
                                                value=""
                                                asBuildArg={false}
                                                isNewVar={true}
                                                onSubmit={(data) => {
                                                    setEnvVars([...envVars, {
                                                        key: data.name,
                                                        value: data.value,
                                                        asBuildArg: data.asBuildArg
                                                    }])
                                                }} />
                                        </div>
                                    )}
                                </div>
                            </Grid>
                        </Grid.Container>
                    </>
                ) : !reposLoading && !installationLoading && !reposData ? (
                    <>
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
                    </>
                ) : (
                    <LoadingSection />
                )}
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

export default CreateAppGithub;
