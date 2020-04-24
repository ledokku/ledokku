import React from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../lib/withApollo';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';
import { useServerByIdQuery } from '../../src/generated/graphql';
import { CreateServer } from '../../src/modules/server/CreateServer';

const Server = () => {
  const router = useRouter();
  const { serverId } = router.query as { serverId: string };
  const { data, loading, error } = useServerByIdQuery({
    variables: {
      id: serverId,
    },
    ssr: false,
  });

  // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  if (!data.server) {
    // TODO nice 404
    return <p>Server not found.</p>;
  }

  return (
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: data.server.id,
        },
      ]}
    >
      {data.server.status === 'NEW' && <CreateServer server={data.server} />}
    </LoggedInLayout>
  );
};

export default withApollo(Server);
