import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../generated/graphql';
import { NodeIcon } from '../ui/icons/NodeIcon';
import { Protected } from '../modules/auth/Protected';
import { Header } from '../modules/layout/Header';
import { TabNav, TabNavLink, Button } from '../ui';

const Dashboard = () => {
  const router = useRouter();
  const { data, loading, error } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  const handleCreateFirstApp = () => {
    router.push('/onboarding/cloud-provider');
  };

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink href="/dashboard" passHref selected>
            Dashboard
          </TabNavLink>
          <TabNavLink href="/activity" passHref>
            Activity
          </TabNavLink>
          <TabNavLink href="/metrics" passHref>
            Metrics
          </TabNavLink>
          <TabNavLink href="/settings" passHref>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <main className="grid grid-cols-12 col-gap-20">
          <div className="col-span-7 mt-4">
            <h1 className="text-lg font-bold py-5 ">Apps</h1>
            {data?.apps.map((app) => (
              <div key={app.id}>
                <Link href="/app/[appId]" as={`/app/${app.id}`} passHref>
                  <a className="py-2 block">
                    <div className="flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                      <NodeIcon size={20} className="mr-2" /> {app.name}
                    </div>
                  </a>
                </Link>
              </div>
            ))}
            <p className="py-3">
              <Link href="/create-app" passHref>
                <a>
                  <Button size="large" color={'grey'}>
                    Create new app
                  </Button>
                </a>
              </Link>
            </p>
            <h1 className="text-lg font-bold py-5">Databases</h1>
            {data?.databases.map((database) => (
              <p key={database.id}>{database.name}</p>
            ))}
            <p className="py-3">
              <Link href="/create-database" passHref>
                <a>
                  <Button size="large" color={'grey'}>
                    Create new database
                  </Button>
                </a>
              </Link>
            </p>
          </div>
          <div className="col-span-5 mt-4">
            <h1 className="text-lg font-bold py-5">Latest activity</h1>
            <p className="text-cool-gray-400">Coming soon</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Dashboard />
  </Protected>
));
