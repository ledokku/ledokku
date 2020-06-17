import React from 'react';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import withApollo from '../../../lib/withApollo';

import { Protected } from '../../../modules/auth/Protected';
import { Header } from '../../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDestroyAppMutation,
  DashboardDocument,
} from '../../../generated/graphql';
import Link from 'next/link';
import { useFormik } from 'formik';
import { TabNav, TabNavLink } from '../../../ui';

const Settings = () => {
  const router = useRouter();
  // // On first render appId will be undefined, the value is set after and a rerender is triggered.
  const { appId } = router.query as { appId?: string };
  const [destroyAppMutation] = useDestroyAppMutation();

  const { data, loading, error } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
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

  const DeleteAppNameSchema = yup.object().shape({
    appName: yup
      .string()
      .required('Required')
      .test(
        'Equals app name',
        'Must match app name',
        (val) => val === data.app.name
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
        const data = await destroyAppMutation({
          variables: {
            input: { appId },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });

        router.push('/dashboard');
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/app/${app.id}`}>App</TabNavLink>
          <TabNavLink to={`/app/${app.id}/databases`}>Databases</TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`} selected>
            Settings
          </TabNavLink>
          <TabNavLink to="/dashboard">Return to dashboard</TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">App settings</h1>

          <h2 className="text-gray-400 w-2/6">
            This action cannot be undone. This will permanently delete{' '}
            {app.name} app and everything related to it. Please type{' '}
            <b>{app.name}</b> to confirm deletion.
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-4">
              <input
                autoComplete="off"
                className="block w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
                id="appNme"
                name="appName"
                value={formik.values.appName}
                onChange={formik.handleChange}
              />
              {!!formik.errors && (
                <p className="text-red-500 text-sm font-semibold">
                  {formik.errors.appName}
                </p>
              )}

              <button
                disabled={!!formik.errors && formik.isSubmitting}
                type="submit"
                className="inline mt-6 py-2 px-10 bg-red-500 hover:bg-blue text-white  font-bold hover:text-white border hover:border-transparent rounded-lg "
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Settings />
  </Protected>
));
