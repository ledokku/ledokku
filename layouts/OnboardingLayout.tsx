import React from 'react';

import { DefaultLayout } from './DefaultLayout';
import { styled, Box, Flex, Page } from '../ui';
import { BreadcrumbHeaderProps } from '../ui/components/Page/components/BreadcrumbHeader';

export interface OnboardingLayoutProps {
  breadcrumb: BreadcrumbHeaderProps['items'];
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  breadcrumb,
}) => (
  <DefaultLayout>
    <Layout padding={24}>
      <Page.BreadcrumbHeader items={breadcrumb} />
      {children}
    </Layout>
  </DefaultLayout>
);

const Layout = styled(Box)`
  box-sizing: border-box;
  display: grid;
  grid-row-gap: 80px;
  max-width: 800px;
  width: 100%;
  margin: 80px auto;

  @media ${({ theme }) => theme.media.phone} {
    margin: 0 auto;
    grid-row-gap: 40px;
  }
`;
