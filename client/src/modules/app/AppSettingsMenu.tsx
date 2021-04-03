import { Button, VStack } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

interface AppSettingsMenuProps {
  app: {
    id: string;
  };
}

export const AppSettingsMenu = ({ app }: AppSettingsMenuProps) => {
  const location = useLocation();

  const selectedRoute = location.pathname.endsWith('/settings/ports')
    ? 'ports'
    : location.pathname.endsWith('/settings/domains')
    ? 'domains'
    : location.pathname.endsWith('/setting/advanced')
    ? 'advanced'
    : 'index';

  return (
    <VStack align="stretch">
      <Button
        variant="ghost"
        justifyContent="left"
        isActive={selectedRoute === 'ports'}
        as={Link}
        to={`/app/${app.id}/settings/ports`}
      >
        Port Management
      </Button>
      <Button
        variant="ghost"
        justifyContent="left"
        isActive={selectedRoute === 'domains'}
        as={Link}
        to={`/app/${app.id}/settings/domains`}
      >
        Domains
      </Button>
      <Button
        variant="ghost"
        justifyContent="left"
        isActive={selectedRoute === 'advanced'}
        as={Link}
        to={`/app/${app.id}/settings/advanced`}
      >
        Advanced
      </Button>
    </VStack>
  );
};
