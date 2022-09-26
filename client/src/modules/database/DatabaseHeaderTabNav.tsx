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
            Base de datos
          </Navbar.Link>

          <Navbar.Link
            href={`/database/${database.id}/logs`}
            isActive={selectedRoute === 'logs'}
          >
            Registros
          </Navbar.Link>
          <Navbar.Link
            href={`/database/${database.id}/settings`}
            isActive={selectedRoute === 'settings'}
          >
            Configuración
          </Navbar.Link>
        </Navbar.Content>
      </Navbar>
    </Container>
  );
};
