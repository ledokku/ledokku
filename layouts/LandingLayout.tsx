import React from 'react';

import { DefaultLayout } from './DefaultLayout';
import { styled, Box, Flex } from '../ui';

export const LandingLayout = ({ children }) => (
  <DefaultLayout>
    <Layout padding={24}>{children}</Layout>
  </DefaultLayout>
);

const Layout = styled(Box)`
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
