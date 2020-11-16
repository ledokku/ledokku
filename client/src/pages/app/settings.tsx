import React from 'react';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDestroyAppMutation,
  DashboardDocument,
} from '../../generated/graphql';
import { useFormik } from 'formik';
import { TabNav, TabNavLink, Button, FormInput, FormHelper } from '../../ui';
import { AppProxyPorts } from '../../modules/appProxyPorts/AppProxyPorts';
import { AppRestart } from '../../modules/app/AppRestart';

export const Settings = () => {
  const { id: appId } = useParams<{ id: string }>();
  let history = useHistory();
  const [
    destroyAppMutation,
    { loading: destroyAppMutationLoading },
  ] = useDestroyAppMutation();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

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
            <AppRestart appId={app.id} />
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
