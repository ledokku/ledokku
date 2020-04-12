import React, { useEffect } from 'react';
import { GitHub } from 'react-feather';
import { useRouter } from 'next/router';

import { LandingLayout } from '../layouts/LandingLayout';
import { Button } from '../ui/components/Button';
import { Headline } from '../ui/components/Typography/components/Headline';
import { Paragraph } from '../ui/components/Typography/components/Paragraph';
import { config } from '../config';
import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../src/generated/graphql';

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
      <p>Yo welcome</p>
      {data?.servers?.length === 0 && (
        <p>
          TODO add empty Dashboard here{' '}
          <button onClick={handleCreateFirstApp}>+ Create a new app</button>
        </p>
      )}
    </div>
  );
};

export default withApollo(Dashboard);
