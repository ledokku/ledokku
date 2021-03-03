import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
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
import { AppRebuild } from '../../modules/app/AppRebuild';
import { AppDomains } from '../../modules/domains/AppDomains';
import { Container, Heading, useToast } from '@chakra-ui/react';
import { toastConfig } from '../utils';

export const Settings = () => {
  const { id: appId } = useParams<{ id: string }>();
  const toast = useToast();
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
        toast({
          description: 'App deleted successfully',
          ...toastConfig('success'),
        });
        history.push('/dashboard');
      } catch (error) {
        toast({
          description: error.message,
          ...toastConfig('error'),
        });
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
      <Container maxW="5xl">
        <TabNav>
          <TabNavLink to={`/app/${app.id}`}>App</TabNavLink>
          <TabNavLink to={`/app/${app.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`} selected>
            Settings
          </TabNavLink>
        </TabNav>
      </Container>

      <Container maxW="5xl">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="pt-10 pb-2">
              <Heading as="h2" size="md" pt={5} pb={2}>
                App settings
              </Heading>
              <p className="text-gray-400 text-sm">
                Update the settings of your app.
              </p>
            </div>
            <AppProxyPorts appId={app.id} />
            <AppRestart appId={app.id} />
            <AppRebuild appId={app.id} />
            <AppDomains appId={appId} />
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
      </Container>
    </div>
  );
};
