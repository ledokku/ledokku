import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../generated/graphql';
import { Protected } from '../modules/auth/Protected';
import { Header } from '../modules/layout/Header';

const Metrics = () => {
  const router = useRouter();
  const { data, loading, error } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-5 text-sm leading-5 border-b border-gray-200">
          <Link href="/dashboard" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Dashboard
            </a>
          </Link>
          <Link href="/activity" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Activity
            </a>
          </Link>
          <Link href="/metrics" passHref>
            <a className="-mb-px border-b border-black text-black py-3 px-0.5">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Metrics</h1>
        </div>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Metrics />
  </Protected>
));
