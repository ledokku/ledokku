import { Container } from '@chakra-ui/layout';
import { useLocation } from 'react-router';
import { TabNav, TabNavLink } from '../../ui';

interface AppHeaderTabNavProps {
  app: {
    id: string;
  };
}

export const AppHeaderTabNav = ({ app }: AppHeaderTabNavProps) => {
  const location = useLocation();

  const selectedRoute = location.pathname.endsWith('/logs')
    ? 'logs'
    : location.pathname.endsWith('/env')
    ? 'env'
    : location.pathname.endsWith('/settings/ports') ||
      location.pathname.endsWith('/settings/domains') ||
      location.pathname.endsWith('/settings/advanced')
    ? 'settings'
    : 'index';

  return (
    <Container maxW="5xl">
      <TabNav>
        <TabNavLink to={`/app/${app.id}`} selected={selectedRoute === 'index'}>
          App
        </TabNavLink>
        <TabNavLink
          to={`/app/${app.id}/logs`}
          selected={selectedRoute === 'logs'}
        >
          Logs
        </TabNavLink>
        <TabNavLink
          to={`/app/${app.id}/env`}
          selected={selectedRoute === 'env'}
        >
          Env setup
        </TabNavLink>
        <TabNavLink
          to={`/app/${app.id}/settings/ports`}
          selected={selectedRoute === 'settings'}
        >
          Settings
        </TabNavLink>
      </TabNav>
    </Container>
  );
};
