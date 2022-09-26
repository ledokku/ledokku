import { Container, Navbar } from '@nextui-org/react';
import { useLocation } from 'react-router';

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
    <Container>
      <Navbar disableShadow>
        <Navbar.Content variant="underline-rounded">
          <Navbar.Link
            href={`/database/${database.id}`}
            isActive={selectedRoute === 'index'}
          >
            Database
          </Navbar.Link>

          <Navbar.Link
            href={`/database/${database.id}/logs`}
            isActive={selectedRoute === 'logs'}
          >
            Logs
          </Navbar.Link>
          <Navbar.Link
            href={`/database/${database.id}/settings`}
            isActive={selectedRoute === 'settings'}
          >
            Settings
          </Navbar.Link>
        </Navbar.Content>
      </Navbar>
    </Container>
  );
};
