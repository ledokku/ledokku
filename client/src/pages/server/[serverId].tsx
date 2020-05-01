import React from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../lib/withApollo';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';
import { useServerByIdQuery } from '../../generated/graphql';
import { CreateServer } from '../../modules/server/CreateServer';
import { Protected } from '../../modules/auth/Protected';

const Server = () => {
  const router = useRouter();
  // On first render serverId will be undefined, the value is set after and a rerender is triggered.
  const { serverId } = router.query as { serverId?: string };
  const { data, loading, error } = useServerByIdQuery({
    variables: {
      id: serverId,
    },
    ssr: false,
    skip: !serverId,
  });

  if (!data) {
    return null;
  }

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
          label: data.server.name,
        },
      ]}
    >
      {data.server.status === 'NEW' && <CreateServer server={data.server} />}
    </LoggedInLayout>
  );
};

export default withApollo(() => (
  <Protected>
    <Server />
  </Protected>
));
