import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { trackGoal } from 'fathom-client';
import * as yup from 'yup';
import {
  useAppsQuery,
  RealTimeLog,
  useAppCreateLogsSubscription,
  useCreateAppGithubMutation,
  useGithubInstallationIdQuery,
  useRepositoriesLazyQuery,
  useBranchesLazyQuery,
} from '../../generated/graphql';
import { Header } from '../../modules/layout/Header';
import {
  Button,
  FormHelper,
  FormInput,
  FormLabel,
  Terminal,
  HeaderContainer,
} from '../../ui';
import { useToast } from '../../ui/toast';
import { config, trackingGoals } from '../../config';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  List,
  ListItem,
} from '@chakra-ui/react';

enum AppCreationStatus {
  FAILURE = 'Failure',
  SUCCESS = 'Success',
}

export const CreateAppGithub = () => {
  const history = useHistory();
  const toast = useToast();
  const { data: dataApps } = useAppsQuery();
  const [isNewWindowClosed, setIsNewWindowClosed] = useState(false);
  const {
    data: installationData,
    loading: installationLoading,
  } = useGithubInstallationIdQuery();
  const [
    getRepos,
    { data: reposData, loading: reposLoading },
  ] = useRepositoriesLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [
    getBranches,
    { data: branchesData, loading: branchesLoading },
  ] = useBranchesLazyQuery({ fetchPolicy: 'cache-and-network' });

  const [arrayOfCreateAppLogs, setArrayOfCreateAppLogs] = useState<
    RealTimeLog[]
  >([]);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
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
    gitRepoUrl: yup
      .string()
      .matches(
        /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/,
        'Must be a valid git link'
      )
      .required(),
    gitBranch: yup.string().optional(),
  });

  const formik = useFormik<{
    name: string;
    gitRepoUrl: string;
    gitBranch: string;
  }>({
    initialValues: {
      name: '',
      gitRepoUrl: '',
      gitBranch: '',
    },

    validateOnChange: true,
    validationSchema: createAppGithubSchema,
    onSubmit: async (values) => {
      try {
        await createAppGithubMutation({
          variables: {
            input: {
              name: values.name,
              gitRepoFullName: 'FULL NAME VALUE THAT YOU GET FROM REPOS QUERY',
              branchName: values.gitBranch,
              gitRepoId: 'MOCK INPUT TO PREVET TYPE ERRORS',
              githubInstallationId: 'MOCK INPUT TO PREVET TYPE ERRORS',
            },
          },
        });
        setIsTerminalVisible(true);
      } catch (error) {
        error.message === 'Not Found'
          ? toast.error(`Repository : ${values.gitRepoUrl} not found`)
          : toast.error(error.message);
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
          // @TODO THIS NEEDS TO BE CHANGED TO SELECTED
          repositoryName: reposData.repositories[0].name,
        },
      });
    }
  }, [
    installationData,
    installationLoading,
    reposData,
    reposLoading,
    getBranches,
  ]);

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

      <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-4">
        <h1 className="text-lg font-bold">Create a new app</h1>
        <div className="mt-12">
          {isTerminalVisible ? (
            <>
              <p className="mb-2 ">
                Creating <b>{formik.values.name}</b> app from{' '}
                <b>{formik.values.gitRepoUrl}</b>
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
            <React.Fragment>
              <div className="mt-4 mb-4">
                <h2 className="text-gray-400">
                  Setup permissions, choose branch and repository and voila!
                </h2>
              </div>
              {isInfoVisible ||
                (!installationData && (
                  <Alert mb="4" mt="4" w="65%" status="info">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle>Set up repository permissions</AlertTitle>
                      <AlertDescription display="block">
                        First you will need to set up permissions for
                        repositories that you would like to use with Ledokku.
                        Once that's done, it's time to choose repo and branch
                        that you would like to create app from and off we go.
                      </AlertDescription>
                    </Box>
                    <CloseButton
                      onClick={() => setIsInfoVisible(false)}
                      position="absolute"
                      right="8px"
                      top="8px"
                    />
                  </Alert>
                ))}
              {!installationData || installationLoading || !reposData ? (
                <Button color="grey" onClick={() => handleOpen()}>
                  Set up permissions
                </Button>
              ) : (
                // @TODO EXCHANGE THIS WITH SELECT ITEMS
                <List>
                  {reposData?.repositories.map((r) => (
                    <ListItem>{r.name}</ListItem>
                  ))}
                </List>
              )}

              {/* <React.Fragment>
                <>
                  <div className="mt-4 mb-4">
                    <h2 className="text-gray-400">
                      Enter app name, github repository URL and click create and
                      voila!
                    </h2>
                  </div>
                  {isWarningVisible && (
                    <Alert mb="4" mt="4" w="65%" status="warning">
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>
                          Currently only works with public repositories
                        </AlertTitle>
                        <AlertDescription display="block">
                          We are doing our best to add suport for private repos.
                          Stay tuned and enjoy automatic git deployments with
                          your public projects.
                        </AlertDescription>
                      </Box>
                      <CloseButton
                        onClick={() => setIsWarningVisible(false)}
                        position="absolute"
                        right="8px"
                        top="8px"
                      />
                    </Alert>
                  )}
                </>
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid grid-cols-3 md:grid-cols-3 gap-10">
                    <div>
                      <FormLabel>App name: </FormLabel>
                      <FormInput
                        autoComplete="off"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(
                          formik.errors.name && formik.touched.name
                        )}
                      />
                      {formik.errors.name ? (
                        <FormHelper status="error">
                          {formik.errors.name}
                        </FormHelper>
                      ) : null}
                    </div>
                    <div>
                      <FormLabel>Git repository url: </FormLabel>
                      <FormInput
                        autoComplete="off"
                        id="gitRepoUrl"
                        name="gitRepoUrl"
                        placeholder="Git repository url"
                        value={formik.values.gitRepoUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(
                          formik.errors.gitRepoUrl && formik.touched.gitRepoUrl
                        )}
                      />
                      {formik.errors.gitRepoUrl ? (
                        <FormHelper status="error">
                          {formik.errors.gitRepoUrl}
                        </FormHelper>
                      ) : null}

                      <FormLabel className="mt-4">Git branch name: </FormLabel>
                      <FormInput
                        autoComplete="off"
                        id="gitBranch"
                        name="gitBranch"
                        placeholder="Git branch name"
                        value={formik.values.gitBranch}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(
                          formik.errors.gitBranch && formik.touched.gitBranch
                        )}
                      />
                      {formik.errors.gitBranch ? (
                        <FormHelper status="error">
                          {formik.errors.gitBranch}
                        </FormHelper>
                      ) : (
                        <FormHelper status="info">
                          If left empty, this will default to{' '}
                          <span className="font-bold">main</span> branch
                        </FormHelper>
                      )}

                      <div className="mt-4 flex justify-end">
                        <Button
                          type="submit"
                          color="grey"
                          disabled={
                            !formik.values.name ||
                            !!formik.errors.name ||
                            !!formik.errors.gitRepoUrl ||
                            !!formik.errors.gitBranch
                          }
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </React.Fragment> */}
            </React.Fragment>
          )}
        </div>
      </div>
    </>
  );
};
