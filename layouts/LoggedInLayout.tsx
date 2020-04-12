import React from 'react';
import { DefaultLayout, DefaultLayoutProps } from './DefaultLayout';
import { BreadcrumbHeaderProps } from '../ui/components/Page/components/BreadcrumbHeader';
import { Page, Divider, Box, Flex } from '../ui';

export interface LoggedInLayoutProps extends DefaultLayoutProps {
  breadcrumb: BreadcrumbHeaderProps['items'];
}

export const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({
  breadcrumb,
  ...props
}) => {
  return (
    <DefaultLayout {...props}>
      <Box padding={24}>
        <Flex justifyContent="space-between">
          <Page.BreadcrumbHeader items={breadcrumb} />

          <div>Profile</div>
        </Flex>
      </Box>
      <Divider.Vertical />
      <span>Hey</span>
    </DefaultLayout>
  );
};
