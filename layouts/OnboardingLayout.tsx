import React from 'react';

import { DefaultLayout } from './DefaultLayout';
import { styled, Box, Page } from '../ui';
import { BreadcrumbHeaderProps } from '../ui/components/Page/components/BreadcrumbHeader';

export interface OnboardingLayoutProps {
  breadcrumb: BreadcrumbHeaderProps['items'];
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  breadcrumb,
}) => (
  <DefaultLayout>
    <Layout>
      <Page.BreadcrumbHeader items={breadcrumb} />
      {children}
    </Layout>
  </DefaultLayout>
);

const Layout = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-row-gap: 80px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 80px 64px 40px;

  @media ${({ theme }) => theme.media.tablet} {
    margin: 0 auto;
    grid-row-gap: 40px;
  }

  @media ${({ theme }) => theme.media.phone} {
    margin: 0 auto;
    grid-row-gap: 40px;
    padding: 24px;
  }
`;
