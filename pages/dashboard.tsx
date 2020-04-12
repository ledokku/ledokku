import React, { useEffect } from 'react';
import { GitHub, Divide, Plus } from 'react-feather';
import { useRouter } from 'next/router';

import { LandingLayout } from '../layouts/LandingLayout';
import { Button } from '../ui/components/Button';
import { Headline } from '../ui/components/Typography/components/Headline';
import { Paragraph } from '../ui/components/Typography/components/Paragraph';
import { config } from '../config';
import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../src/generated/graphql';
import { LoggedInLayout } from '../layouts/LoggedInLayout';
import { Typography, BoxButton, Grid } from '../ui';
import { RubyIcon } from '../ui/icons/RubyIcon';
import { PHPIcon } from '../ui/icons/PHPIcon';
import { NodeIcon } from '../ui/icons/NodeIcon';

const Dashboard = () => {
  const router = useRouter();
  const { data, loading, error } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  const handleCreateFirstApp = () => {
    router.push('/onboarding/cloud-provider');
  };

  return (
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Dashboard',
        },
      ]}
    >
      {data?.servers?.length === 0 && (
        <Grid
          fullHeight={true}
          rowGap={40}
          justifyContent="center"
          justifyItems="center"
          alignContent="center"
        >
          <Typography.Paragraph marginBottom={0} textAlign="center">
            First thing first!
          </Typography.Paragraph>
          <BoxButton
            onClick={handleCreateFirstApp}
            icon={<Plus />}
            label="Create a new app"
            size="large"
          />
          <Grid templateColumns="24px 24px 24px" columnGap={32}>
            <RubyIcon opacity={0.2} />
            <PHPIcon opacity={0.2} />
            <NodeIcon opacity={0.2} />
          </Grid>
        </Grid>
      )}
      {data?.servers.map((server) => (
        <div key={server.id}>
          <p>Server name: {server.name}</p>
          <p>Apps:</p>
          {server.apps?.map((app) => (
            <div key={app.id}>App name: {app.name}</div>
          ))}
          <p>Databases:</p>
          {server.databases?.map((database) => (
            <div key={database.id}>Database name: {database.name}</div>
          ))}
          <p>-----------------------------</p>
        </div>
      ))}
    </LoggedInLayout>
  );
};

export default withApollo(Dashboard);
