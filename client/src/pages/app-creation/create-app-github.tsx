import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { trackGoal } from 'fathom-client';
import Select from 'react-select';
import * as yup from 'yup';
import {
  useAppsQuery,
  RealTimeLog,
  useAppCreateLogsSubscription,
  useCreateAppGithubMutation,
  useGithubInstallationIdQuery,
  useRepositoriesLazyQuery,
  useBranchesLazyQuery,
  Repository,
  Branch,
  useUserQuery,
} from '../../generated/graphql';
import { Header } from '../../modules/layout/Header';
import { Button, Terminal, HeaderContainer } from '../../ui';
import { useToast } from '../../ui/toast';
import { config, trackingGoals } from '../../config';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Container,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../../modules/auth/AuthContext';

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

  const { data: dataApps } = useAppsQuery();
  const { data: userData } = useUserQuery();
  const [isNewWindowClosed, setIsNewWindowClosed] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState({} as Repository);
  const [selectedBranch, setSelectedBranch] = useState('');
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
    RealTimeLog[]
  >([]);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isToastShown, setIsToastShown] = useState(false);
  const [createAppGithubMutation] = useCreateAppGithubMutation();
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
        (val) => !dataApps?.apps.find((app) => app.name === val)
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
        } catch (error) {
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
      `https://github.com/apps/${config.githubAppName}/installations/new`,
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
      reposData
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
    selectedRepo.name,
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

  console.log(reposData);

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
  }, [selectedRepo]);

  console.log(formik.values);

  // Effect for app creation
  useEffect(() => {
    isAppCreationSuccess === AppCreationStatus.FAILURE && !isToastShown
      ? toast.error('Failed to create an app') && setIsToastShown(true)
      : isAppCreationSuccess === AppCreationStatus.SUCCESS &&
        !isToastShown &&
        toast.success('App created successfully') &&
        setIsToastShown(true);
  }, [isToastShown, isAppCreationSuccess, toast]);

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        {isTerminalVisible ? (
          <>
            <p className="mb-2 ">
              Creating <b>{formik.values.name}</b> app from{' '}
              <b>{formik.values.repo.name}</b>
            </p>
            <p className="text-gray-500 mb-2">
              Creating app usually takes a couple of minutes. Breathe in,
              breathe out, logs are about to appear below:
            </p>
            <Terminal className={'w-6/6'}>
              {arrayOfCreateAppLogs.map((log) => (
                <p
                  key={arrayOfCreateAppLogs.indexOf(log)}
                  className={'text-s leading-5'}
                >
                  {log.message?.replaceAll('[1G', '')}
                </p>
              ))}
            </Terminal>

            {!!isAppCreationSuccess &&
            isAppCreationSuccess === AppCreationStatus.SUCCESS ? (
              <div className="mt-12 flex justify-end">
                <Button
                  onClick={() => handleNext()}
                  color="grey"
                  iconEnd={<FiArrowRight size={20} />}
                >
                  Next
                </Button>
              </div>
            ) : !!isAppCreationSuccess &&
              isAppCreationSuccess === AppCreationStatus.FAILURE ? (
              <div className="mt-12 flex justify-start">
                <Button
                  onClick={() => {
                    setIsTerminalVisible(false);
                    formik.resetForm();
                  }}
                  color="grey"
                  iconEnd={<FiArrowLeft size={20} />}
                >
                  Back
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <Heading as="h2" size="md">
              Create a new GitHub application
            </Heading>
            {installationData &&
            !installationLoading &&
            reposData &&
            !reposLoading ? (
              <>
                <Text color="gray.400">
                  When you push to Git, your application will be redeployed
                  automatically.
                </Text>

                <Grid
                  templateColumns={{
                    sm: 'repeat(1, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                >
                  <GridItem colSpan={2}>
                    <Flex alignItems="center" mt="12">
                      {/* TODO change name and src props */}
                      <Avatar
                        size="sm"
                        name={userData?.user.userName}
                        src={user?.avatarUrl}
                      />
                      <Text ml="2" fontWeight="bold">
                        {userData?.user.userName}
                      </Text>
                    </Flex>
                    <form onSubmit={formik.handleSubmit}>
                      <Box mt="8">
                        <FormLabel>Repository</FormLabel>
                        <Select
                          placeholder="Select repository"
                          isSearchable={false}
                          onChange={handleChangeRepo}
                          options={repoOptions}
                        />
                      </Box>

                      <Text mt="1" color="gray.400" fontSize="sm">
                        Can't see your repo in the list?{' '}
                        <Link
                          onClick={() => handleOpen()}
                          textDecoration="underline"
                        >
                          Configure the GitHub app.
                        </Link>
                      </Text>

                      <Box mt="8">
                        <FormLabel>Branch to deploy</FormLabel>
                        <Select
                          placeholder="Select branch"
                          isSearchable={false}
                          disabled={
                            !branchesData ||
                            branchesLoading ||
                            reposLoading ||
                            !reposData
                          }
                          onChange={handleChangeBranch}
                          options={branchOptions}
                        />
                      </Box>

                      <Box mt="8" display="flex" justifyContent="flex-end">
                        <Button
                          type="submit"
                          color="grey"
                          disabled={!selectedBranch || !selectedRepo}
                          // disabled={
                          //   loading || !formik.values.name || !!formik.errors.name
                          // }
                          // isLoading={loading}
                        >
                          Create
                        </Button>
                      </Box>
                    </form>
                  </GridItem>
                </Grid>
              </>
            ) : !reposLoading && !installationLoading && !reposData ? (
              <>
                <Alert mb="4" mt="4" w="65%" status="info">
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>Set up repository permissions</AlertTitle>
                    <AlertDescription display="block">
                      First you will need to set up permissions for repositories
                      that you would like to use with Ledokku. Once that's done,
                      it's time to choose repo and branch that you would like to
                      create app from and off we go.
                    </AlertDescription>
                  </Box>
                </Alert>

                <Button color="grey" onClick={() => handleOpen()}>
                  Set up permissions
                </Button>
              </>
            ) : (
              <Spinner />
            )}
          </>
        )}
      </Container>
    </>
  );
};
