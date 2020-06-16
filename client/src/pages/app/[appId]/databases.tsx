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
import { TabNav, TabNavLink, Button } from '../../../ui';

const Databases = () => {
  const router = useRouter();
  // // On first render appId will be undefined, the value is set after and a rerender is triggered.
  const { appId } = router.query as { appId?: string };

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

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink href="/app/[appId]" as={`/app/${app.id}`} passHref>
            App
          </TabNavLink>
          <TabNavLink
            href="/app/[appId]/databases"
            as={`/app/${app.id}/databases`}
            passHref
            selected
          >
            Databases
          </TabNavLink>
          <TabNavLink
            href="/app/[appId]/env"
            as={`/app/${app.id}/env`}
            passHref
          >
            Env setup
          </TabNavLink>
          <TabNavLink
            href="/app/[appId]/settings"
            as={`/app/${app.id}/settings`}
            passHref
          >
            Settings
          </TabNavLink>
          <TabNavLink href="/dashboard" passHref>
            Return to dashboard
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Databases</h1>
        </div>
        <div className="mt-4 mb-4">
          <h2 className="text-gray-400">
            {`Here you can modify databases linked to:`}
            <span className="text-gray-900"> {app.name}</span> app
          </h2>
        </div>
        <Button color="grey">Connect database</Button>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Databases />
  </Protected>
));
