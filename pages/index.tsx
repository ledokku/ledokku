import React from 'react';
import { GitHub } from 'react-feather';

import { LandingLayout } from '../layouts/LandingLayout';
import { Button } from '../ui/components/Button';
import { Headline } from '../ui/components/Typography/components/Headline';
import { Paragraph } from '../ui/components/Typography/components/Paragraph';

const Home = () => (
  <LandingLayout>
    <Headline level={1} marginTop={0} marginBottom={32} textAlign="center">
      Ledokku
    </Headline>
    <Paragraph marginTop={0} marginBottom={32} textAlign="center">
      Have you ever felt like creating a thing?
      <br />
      Well now you can!
    </Paragraph>
    <Button size="large" startIcon={<GitHub />}>
      Log in with Github
    </Button>
  </LandingLayout>
);

export default Home;
