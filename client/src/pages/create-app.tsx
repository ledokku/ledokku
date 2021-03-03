import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useCreateAppMutation,
  useAppsQuery,
  RealTimeLog,
  useAppCreateLogsSubscription,
} from '../generated/graphql';
import { Header } from '../modules/layout/Header';
import { Button, FormHelper, FormInput, FormLabel, Terminal } from '../ui';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight } from 'react-feather';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/alert';
import { Box } from '@chakra-ui/layout';
import { CloseButton } from '@chakra-ui/close-button';

enum AppCreationStatus {
  FAILURE = 'Failure',
  SUCCESS = 'Success',
}

export const CreateApp = () => {
  const history = useHistory();
  const { data: dataApps } = useAppsQuery();
  const [arrayOfCreateAppLogs, setArrayOfCreateAppLogs] = useState<
    RealTimeLog[]
  >([]);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(true);
  const [createAppMutation] = useCreateAppMutation();
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

  const createAppSchema = yup.object().shape({
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
        /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/
      ),
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
    validationSchema: createAppSchema,
    onSubmit: async (values) => {
      try {
        await createAppMutation({
          variables: {
            input: {
              name: values.name,
              gitRepoUrl: values.gitRepoUrl,
              branchName: values.gitBranch ? values.gitBranch : undefined,
            },
          },
        });
        setIsTerminalVisible(true);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const handleNext = () => {
    setIsTerminalVisible(false);
    const appId = arrayOfCreateAppLogs[arrayOfCreateAppLogs.length - 1].message;
    history.push(`app/${appId}`);
  };

  // Effect for app creation
  useEffect(() => {
    isAppCreationSuccess === AppCreationStatus.FAILURE
      ? toast.error('Failed to create an app')
      : isAppCreationSuccess === AppCreationStatus.SUCCESS &&
        toast.success('App created successfully');
  }, [isAppCreationSuccess]);

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                    iconEnd={<ArrowRight />}
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
                    iconEnd={<ArrowLeft />}
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
                      Stay tuned and enjoy automatic git deployments with your
                      public projects.
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
                      error={Boolean(formik.errors.name && formik.touched.name)}
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
                    ) : null}

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
            </React.Fragment>
          )}
        </div>
      </div>
    </>
  );
};
