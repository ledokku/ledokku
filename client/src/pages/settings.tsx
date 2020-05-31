import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../generated/graphql';
import { Protected } from '../modules/auth/Protected';
import { Header } from '../modules/layout/Header';
import { TabNav, TabNavLink } from '../ui';

const Settings = () => {
  const router = useRouter();
  const { data, loading, error } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink href="/dashboard" passHref>
            Dashboard
          </TabNavLink>
          <TabNavLink href="/activity" passHref>
            Activity
          </TabNavLink>
          <TabNavLink href="/metrics" passHref>
            Metrics
          </TabNavLink>
          <TabNavLink href="/settings" passHref selected>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Settings</h1>
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
