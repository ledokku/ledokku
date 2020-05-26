import React from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../lib/withApollo';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';

import { Protected } from '../../modules/auth/Protected';
import { Header } from '../../modules/layout/Header';
import { useAppByIdQuery } from '../../generated/graphql';

const App = () => {
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

  console.log(data);

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  if (!data.app) {
    // TODO nice 404
    return <p>Server not found.</p>;
  }

  return (
    <div className="container mx-auto">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex bg-gray-200">
          <div className="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
            Basic info
          </div>
          {}
          <div className="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
            Logs
          </div>
        </div>
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <App />
  </Protected>
));
