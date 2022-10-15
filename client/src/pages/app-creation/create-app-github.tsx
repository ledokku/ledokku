import { Button, Dropdown, Grid, Link, Loading, Modal, Text, User } from '@nextui-org/react';
import { trackGoal } from 'fathom-client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { TerminalOutput } from 'react-terminal-ui';
import * as yup from 'yup';
import { GITHUB_APP_NAME, trackingGoals } from '../../constants';
import {
  Branch, LogPayload, Repository, useAppCreateLogsSubscription, useAppsQuery, useBranchesLazyQuery, useCreateAppGithubMutation,
  useGithubInstallationIdQuery,
  useRepositoriesLazyQuery
} from '../../generated/graphql';
import { useAuth } from '../../modules/auth/AuthContext';
import { Alert } from '../../ui/components/Alert';
import { useToast } from '../../ui/toast';
import { Terminal } from '../../ui/components/Terminal';
import { LoadingSection } from '../../ui/components/LoadingSection';

enum AppCreationStatus {
  FAILURE = 'Failure',
  SUCCESS = 'Success',
}

interface RepoOption {
  value: Repository;
  label: string;
}

interface BranchOption {
  value: Branch;
  label: string;
}

export const CreateAppGithub = () => {
  const history = useHistory();
  const toast = useToast();
  const { user } = useAuth();

  const { data: dataApps } = useAppsQuery({
    variables: {
      limit: 1_000_000
    }
  });
  const [isNewWindowClosed, setIsNewWindowClosed] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository>();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isProceedModalOpen, setIsProceedModalOpen] = useState(false);
  const {
    data: installationData,
    loading: installationLoading,
  } = useGithubInstallationIdQuery({ fetchPolicy: 'network-only' });
  const [
    getRepos,
    { data: reposData, loading: reposLoading },
  ] = useRepositoriesLazyQuery({ fetchPolicy: 'network-only' });

  const [
    getBranches,
    { data: branchesData, loading: branchesLoading },
  ] = useBranchesLazyQuery({ fetchPolicy: 'network-only' });

  const [arrayOfCreateAppLogs, setArrayOfCreateAppLogs] = useState<
    LogPayload[]
  >([]);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isToastShown, setIsToastShown] = useState(false);
  const [createAppGithubMutation, { loading }] = useCreateAppGithubMutation();
  const [
    isAppCreationSuccess,
    setIsAppCreationSuccess,
  ] = useState<AppCreationStatus>();

  useAppCreateLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appCreateLogs;

      if (logsExist) {
        setArrayOfCreateAppLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (logsExist.type === 'end:success') {
          setIsAppCreationSuccess(AppCreationStatus.SUCCESS);
        } else if (logsExist.type === 'end:failure') {
          setIsAppCreationSuccess(AppCreationStatus.FAILURE);
        }
      }
    },
  });

  const createAppGithubSchema = yup.object().shape({
    name: yup
      .string()
      .required('App name is required')
      .matches(/^[a-z0-9-]+$/)
      .test(
        'Name exists',
        'App with this name already exists',
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
    },

    validateOnChange: true,
    validationSchema: createAppGithubSchema,
    onSubmit: async (values) => {
      if (installationData) {
        try {
          await createAppGithubMutation({
            variables: {
              input: {
                name: values.name,
                gitRepoFullName: values.repo.fullName,
                branchName: values.gitBranch,
                gitRepoId: values.repo.id,
                githubInstallationId: values.installationId,
              },
            },
          });
          setIsTerminalVisible(true);
        } catch (error: any) {
          error.message === 'Not Found'
            ? toast.error(`Repository : ${values.repo.fullName} not found`)
            : toast.error(error.message);
        }
      }
    },
  });

  const handleNext = () => {
    setIsTerminalVisible(false);
    const appId = arrayOfCreateAppLogs[arrayOfCreateAppLogs.length - 1].message;
    history.push(`app/${appId}`, 'new');
    trackGoal(trackingGoals.createAppGithub, 0);
  };

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
  }, [
    installationData,
    installationLoading,
    isNewWindowClosed,
    setIsNewWindowClosed,
    getRepos,
  ]);

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
      formik.setValues({
        name: active.value.name,
        installationId: installationData?.githubInstallationId.id,
        repo: {
          fullName: active.value.fullName,
          name: active.value.name,
          id: active.value.id,
        },
        gitBranch: '',
      });
    }
  };

  const handleChangeBranch = (active: BranchOption) => {
    setSelectedBranch(active.value.name);
    formik.setFieldValue('gitBranch', active.value.name);
  };

  const repoOptions: RepoOption[] = [];

  if (reposData && !reposLoading) {
    reposData?.repositories.map((r) =>
      repoOptions.push({ value: r, label: r.fullName })
    );
  }

  let branchOptions: BranchOption[] = [];

  if (branchesData && !branchesLoading) {
    branchesData.branches.map((b) =>
      branchOptions.push({ value: b, label: b.name })
    );
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

  // Effect for app creation
  useEffect(() => {
    isAppCreationSuccess === AppCreationStatus.FAILURE && !isToastShown
      ? toast.error('Error al crear aplicación') && setIsToastShown(true)
      : isAppCreationSuccess === AppCreationStatus.SUCCESS &&
      !isToastShown &&
      toast.success('Aplicación creada') &&
      setIsToastShown(true);
  }, [isToastShown, isAppCreationSuccess, toast]);

  return (
    <>
      {isTerminalVisible ? (
        <>
          <Text className="mb-2">
            Creando la aplicación <b>{formik.values.name}</b> desde{' '}
            <b>{formik.values.repo.name}</b>
          </Text>
          <p className="mb-2">
            Crear una aplicación usualmente toma unos cuantos minutos. Respira un poco, los registros aparecerán pronto:
          </p>
          <Terminal>
            {arrayOfCreateAppLogs.map((log) => (<TerminalOutput>{log.message}</TerminalOutput>))}
          </Terminal>

          {!!isAppCreationSuccess &&
            isAppCreationSuccess === AppCreationStatus.SUCCESS ? (
            <div className="mt-12 flex justify-end">
              <Button
                flat
                onClick={() => handleNext()}
                iconRight={<FiArrowRight size={20} />}
              >
                Siguiente
              </Button>
            </div>
          ) : !!isAppCreationSuccess &&
            isAppCreationSuccess === AppCreationStatus.FAILURE ? (
            <div className="mt-12 flex justify-start">
              <Button
                flat
                onClick={() => {
                  setIsTerminalVisible(false);
                  formik.resetForm();
                }}
                icon={<FiArrowLeft size={20} />}
              >
                Atras
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Text h2>
            Crear nueva aplicación de Github
          </Text>
          {installationData &&
            !installationLoading &&
            reposData &&
            !reposLoading ? (
            <>
              <Text>
                Cuando hagas push a Git, tu aplicación va a lanzarse de nuevo automaticamente.
              </Text>

              <Grid.Container>
                <Grid>
                  <User className='my-8' name={user?.userName} src={user?.avatarUrl} />
                  <form onSubmit={formik.handleSubmit}>
                    <Text h5>Repositorio</Text>
                    <Dropdown>
                      <Dropdown.Button flat>
                        {selectedRepo?.fullName ?? "Selecciona un repositorio"}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        color='primary'
                        css={{ $$dropdownMenuWidth: "auto" }}
                        selectionMode='single'
                        selectedKeys={new Set(selectedRepo?.id ? [selectedRepo?.id] : [])}
                        onAction={(key) => {
                          const repo = repoOptions.find((item) => item.value.id === key)

                          if (repo) {
                            handleChangeRepo(repo)
                          }
                        }}>
                        {repoOptions.map((option) => (<Dropdown.Item key={option.value.id}>{option.label}</Dropdown.Item>))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <Text className='mt-1' h6>
                      ¿No puedes ver los repositorios privados?{' '}
                      <Link
                        onClick={() => setIsProceedModalOpen(true)}
                        css={{ display: "inline" }}
                      >
                        Configura la app de Github
                      </Link>
                    </Text>

                    <Text h5 className='mt-8'>Rama a lanzar</Text>
                    <Dropdown >
                      <Dropdown.Button flat disabled={!branchesData ||
                        branchesLoading ||
                        reposLoading ||
                        !reposData}>
                        {branchesLoading ? <Loading color="currentColor" size='sm' /> : selectedBranch !== "" ? selectedBranch : "Selecciona una rama"}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        color='primary'
                        css={{ $$dropdownMenuWidth: "auto" }}
                        selectionMode='single'
                        selectedKeys={new Set(selectedBranch ? [selectedBranch] : [])}
                        onAction={(key) => {
                          const repo = branchOptions.find((item) => item.value.name === key)

                          if (repo) {
                            handleChangeBranch(repo)
                          }
                        }}>
                        {branchOptions.map((option) => (<Dropdown.Item key={option.value.name}>{option.label}</Dropdown.Item>))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <Button
                      className='mt-8'
                      type="submit"
                      disabled={!selectedBranch || !selectedRepo}
                    >
                      {!loading ? "Crear" : <Loading color="currentColor" />}
                    </Button>
                  </form>
                </Grid>
              </Grid.Container>
            </>
          ) : !reposLoading && !installationLoading && !reposData ? (
            <>
              <Alert
                className='my-8'
                title='Configura los permisos de repositorios'
                type='warning'
                message="Primero necesitas configurar los permisos de los repositorios
                que te gustaria usar. Una vez completado,
                es hora de escoger el repositorio y la rama que te gustaria para crear la aplicación."/>
              <Button
                onClick={() => setIsProceedModalOpen(true)}
              >
                Configurar permisos
              </Button>
            </>
          ) : (
            <LoadingSection />
          )}
        </>
      )}
      <Modal
        blur
        closeButton
        open={isProceedModalOpen}
        onClose={() => setIsProceedModalOpen(false)}
      >
        <Modal.Header><Text h4>Configuración de Github</Text></Modal.Header>
        <Modal.Body>
          Una nueva ventana se abrirá. Después de que hayas finalizado de seleccionar los repositorios, cierra esa ventana para refrescar.
        </Modal.Body>
        <Modal.Footer>
          <div className='flex flex-row'>
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
    </>
  );
};
