import { Container } from '@chakra-ui/layout';
import { useLocation } from 'react-router';
import { TabNav, TabNavLink } from '../../ui';

export const HomeHeaderTabNav = () => {
  const location = useLocation();

  return (
    <Container maxW="5xl">
      <TabNav>
        <TabNavLink
          to="/dashboard"
          selected={location.pathname === '/dashboard'}
        >
          Dashboard
        </TabNavLink>
        <TabNavLink to="/activity" selected={location.pathname === '/activity'}>
          Activity
        </TabNavLink>
        <TabNavLink to="/metrics" selected={location.pathname === '/metrics'}>
          Metrics
        </TabNavLink>
        <TabNavLink to="/settings" selected={location.pathname === '/settings'}>
          Settings
        </TabNavLink>
      </TabNav>
    </Container>
  );
};
