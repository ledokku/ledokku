import React from 'react';
import { GitHub } from 'react-feather';

import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import { Button } from '../../ui/components/Button';
import { Headline } from '../../ui/components/Typography/components/Headline';
import { Paragraph } from '../../ui/components/Typography/components/Paragraph';

const CloudProvider = () => (
  <OnboardingLayout
    breadcrumb={[
      {
        label: 'Pick your cloud provider',
      },
    ]}
  >
    {/* Here put content, Leo */}
  </OnboardingLayout>
);

export default CloudProvider;
