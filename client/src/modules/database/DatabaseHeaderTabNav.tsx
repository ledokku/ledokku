import { Container } from '@chakra-ui/layout';
import { useLocation } from 'react-router';
import { TabNav, TabNavLink } from '../../ui';

interface DatabaseHeaderTabNavProps {
  database: {
    id: string;
  };
}

export const DatabaseHeaderTabNav = ({
  database,
}: DatabaseHeaderTabNavProps) => {
  const location = useLocation();

  const selectedRoute = location.pathname.endsWith('/settings')
    ? 'settings'
    : location.pathname.endsWith('/logs')
    ? 'logs'
    : 'index';

  return (
    <Container maxW="5xl">
      <TabNav>
        <TabNavLink
          to={`/database/${database.id}`}
          selected={selectedRoute === 'index'}
        >
          Database
        </TabNavLink>

        <TabNavLink
          to={`/database/${database.id}/logs`}
          selected={selectedRoute === 'logs'}
        >
          Logs
        </TabNavLink>
        <TabNavLink
          to={`/database/${database.id}/settings`}
          selected={selectedRoute === 'settings'}
        >
          Settings
        </TabNavLink>
      </TabNav>
    </Container>
  );
};
