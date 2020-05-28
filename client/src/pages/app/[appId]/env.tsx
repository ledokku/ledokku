import React from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../../lib/withApollo';

import { Protected } from '../../../modules/auth/Protected';
import { Header } from '../../../modules/layout/Header';
import { useAppByIdQuery, useAppLogsQuery } from '../../../generated/graphql';
import Link from 'next/link';

const Env = () => {
  const router = useRouter();
  console.log(router);
  // // On first render appId will be undefined, the value is set after and a rerender is triggered.
  const { appId } = router.query as { appId?: string };
  const { data, loading, error } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  const {
    data: appLogsData,
    loading: appLogsLoading,
    error: appLogsError,
  } = useAppLogsQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
    // we fetch status every 5 min
    pollInterval: 300000,
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
        <nav className="flex space-x-5 text-sm leading-5 border-b border-gray-200">
          <Link href="/app/[appId]" as={`/app/${app.id}`} passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              App
            </a>
          </Link>
          <Link href="/app/[appId]/env" as={`/app/${app.id}/env`} passHref>
            <a className="-mb-px border-b border-black text-black py-3 px-0.5">
              Env setup
            </a>
          </Link>
          <Link
            href="/app/[appId]/settings"
            as={`/app/${app.id}/settings`}
            passHref
          >
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Settings
            </a>
          </Link>
          <Link href="/dashboard" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-15">
              Return to dashboard
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Env />
  </Protected>
));
