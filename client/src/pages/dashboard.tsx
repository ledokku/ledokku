import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../generated/graphql';
import { NodeIcon } from '../ui/icons/NodeIcon';
import { Protected } from '../modules/auth/Protected';
import { Header } from '../modules/layout/Header';

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
        <nav className="flex space-x-5 text-sm leading-5 border-b border-gray-200">
          <Link href="/dashboard" passHref>
            <a className="-mb-px border-b border-black text-black py-3 px-0.5">
              Dashboard
            </a>
          </Link>
          <Link href="/activity" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Activity
            </a>
          </Link>
          <Link href="/metrics" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Metrics
            </a>
          </Link>
          <Link href="/settings" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Settings
            </a>
          </Link>
        </nav>
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
                <button className="inline w-2/3 py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white border hover:border-transparent rounded-lg">
                  Create new app
                </button>
              </Link>
            </p>
            <h1 className="text-lg font-bold py-5">Databases</h1>
            {data?.databases.map((database) => (
              <p key={database.id}>{database.name}</p>
            ))}
            <p className="py-3">
              <Link href="/create-database" passHref>
                <button className="inline w-2/3 py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white border hover:border-transparent rounded-lg">
                  Create new database
                </button>
              </Link>
            </p>
          </div>
          <div className="col-span-5 mt-4">
            <h1 className="text-lg font-bold py-5">Latest activity</h1>
            <p>TODO</p>
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
