import React from 'react';
import { DefaultLayout, DefaultLayoutProps } from './DefaultLayout';
import { BreadcrumbHeaderProps } from '../ui/components/Page/components/BreadcrumbHeader';
import { Page, Divider, Box, Flex } from '../ui';
import { useAuth } from '../modules/auth/AuthContext';

export interface LoggedInLayoutProps extends DefaultLayoutProps {
  breadcrumb: BreadcrumbHeaderProps['items'];
}

export const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({
  breadcrumb,
  children,
  ...props
}) => {
  const { logout } = useAuth();

  return (
    <DefaultLayout {...props}>
      <Flex fullHeight={true} flexDirection="column">
        <Box padding={24}>
          <Flex justifyContent="space-between">
            <Page.BreadcrumbHeader items={breadcrumb} />

            {/* TODO Clean this part */}
            <div onClick={() => logout()}>Profile</div>
          </Flex>
        </Box>
        <Divider.Horizontal />
        {children}
      </Flex>
    </DefaultLayout>
  );
};
