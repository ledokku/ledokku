import React, { useState } from 'react';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDestroyAppMutation,
  useRestartAppMutation,
  useAppRestartLogsSubscription,
  DashboardDocument,
  RealTimeLog,
} from '../../generated/graphql';
import { useFormik } from 'formik';
import {
  TabNav,
  TabNavLink,
  Button,
  Modal,
  ModalTitle,
  ModalDescription,
  ModalButton,
  Terminal,
  FormInput,
  FormHelper,
} from '../../ui';
import { AppProxyPorts } from '../../modules/appProxyPorts/AppProxyPorts';

export const Settings = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [isRestartAppModalOpen, setIsRestartAppModalOpen] = useState(false);
  const [arrayOfRestartLogs, setArrayOfRestartLogs] = useState<RealTimeLog[]>(
    []
  );
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState<
    'running' | 'notStarted' | 'finished'
  >('notStarted');
  let history = useHistory();
  const [
    destroyAppMutation,
    { loading: destroyAppMutationLoading },
  ] = useDestroyAppMutation();

  const [
    restartAppMutation,
    { loading: restartAppMutationLoading },
  ] = useRestartAppMutation();

  const { data, loading /* error */, refetch } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  useAppRestartLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.appRestartLogs;
      if (logsExist) {
        setArrayOfRestartLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (
          logsExist.type === 'end:success' ||
          logsExist.type === 'end:failure'
        ) {
          setProcessStatus('finished');
        }
      }
    },
  });

  const handleRestartApp = async () => {
    try {
      await restartAppMutation({
        variables: {
          input: {
            appId,
          },
        },
      });
      setIsTerminalVisible(true);
      setRestartLoading(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const DeleteAppNameSchema = yup.object().shape({
    appName: yup
      .string()
      .required('Required')
      .test(
        'Equals app name',
        'Must match app name',
        (val) => val === data?.app?.name
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
            input: { appId },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        toast.success('App deleted successfully');
        history.push('/dashboard');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/app/${app.id}`}>App</TabNavLink>
          <TabNavLink to={`/app/${app.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`} selected>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 mt-10">
          <div>
            <div className="py-5">
              <h1 className="text-lg font-bold">App settings</h1>
              <p className="text-gray-400 text-sm">
                Update the settings of your app.
              </p>
            </div>

            <AppProxyPorts appId={app.id} />
            <h1 className="text-md font-bold mt-6">Restart app</h1>
            <p className="text-gray-400 ">
              Restart your dokku app and see logs in real time.
            </p>

            <div className="mt-1">
              <Button
                onClick={() => setIsRestartAppModalOpen(true)}
                color="grey"
                className="mt-2"
              >
                Restart
              </Button>
            </div>
            {isRestartAppModalOpen && (
              <Modal>
                <ModalTitle>Restart app</ModalTitle>
                <ModalDescription>
                  {isTerminalVisible ? (
                    <React.Fragment>
                      <p className="mb-2 ">Restarting {app.name}</p>
                      <p className="text-gray-500 mb-2">
                        Restarting the app usually takes couple of minutes.
                        Breathe in, breathe out, logs are about to appear below:
                      </p>
                      <Terminal className={'w-6/6'}>
                        {arrayOfRestartLogs.map((log) => (
                          <p
                            key={arrayOfRestartLogs.indexOf(log)}
                            className="text-s leading-5"
                          >
                            {log.message}
                          </p>
                        ))}
                      </Terminal>
                    </React.Fragment>
                  ) : (
                    <p>
                      {`Are you sure, you want to restart ${app.name} app ?`}
                    </p>
                  )}
                </ModalDescription>
                <ModalButton
                  ctaFn={() => {
                    setProcessStatus('running');
                    handleRestartApp();
                  }}
                  ctaText={'Restart'}
                  otherButtonText={'Cancel'}
                  isCtaLoading={isTerminalVisible ? false : restartLoading}
                  isCtaDisabled={isTerminalVisible}
                  isOtherButtonDisabled={processStatus === 'running'}
                  closeModal={() => {
                    setIsRestartAppModalOpen(false);
                    refetch({ appId });
                    setRestartLoading(false);
                    setIsTerminalVisible(false);
                    setProcessStatus('notStarted');
                  }}
                />
              </Modal>
            )}

            <h1 className="text-md font-bold py-5">Delete app</h1>
            <p className="text-gray-400">
              This action cannot be undone. This will permanently delete{' '}
              {app.name} app and everything related to it. Please type{' '}
              <b>{app.name}</b> to confirm deletion.
            </p>
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-4">
                <FormInput
                  autoComplete="off"
                  id="appNme"
                  name="appName"
                  value={formik.values.appName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.errors.appName && formik.touched.appName
                  )}
                />
                {formik.errors.appName && formik.errors.appName ? (
                  <FormHelper status="error">
                    {formik.errors.appName}
                  </FormHelper>
                ) : null}
                <Button
                  type="submit"
                  disabled={!formik.values.appName || !!formik.errors.appName}
                  color="red"
                  isLoading={destroyAppMutationLoading}
                  className="mt-2"
                >
                  Delete
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
