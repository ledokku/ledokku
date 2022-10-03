import { Avatar, Dropdown, Navbar } from '@nextui-org/react';
import { useLocation } from 'react-router';
import useDarkMode from 'use-dark-mode';
import { useAuth } from '../../modules/auth/AuthContext';
import { OCStudiosLogo } from '../icons/OCStudiosLogo';

export const Header = () => {
  const { user, logout } = useAuth();
  const darkMode = useDarkMode(false);
  const location = useLocation();

  return (
    <Navbar >
      <Navbar.Brand><OCStudiosLogo /></Navbar.Brand>
      <Navbar.Content variant='underline-rounded'>
        <Navbar.Link href='/dashboard' isActive={location.pathname === '/dashboard'}>Panel de control</Navbar.Link>
        <Navbar.Link href='/activity' isActive={location.pathname === '/activity'}>Actividad</Navbar.Link>
        <Navbar.Link href='/metrics' isActive={location.pathname === '/metrics'}>Metricas</Navbar.Link>
        <Navbar.Link href='/settings' isActive={location.pathname === '/settings'}>Configuración</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <Dropdown>
            <Dropdown.Button light><Avatar src={user?.avatarUrl} size="sm" className='mr-2' bordered color="default" /> {user?.userName}</Dropdown.Button>
            <Dropdown.Menu onAction={(key) => {
              switch (key) {
                case "logout":
                  logout()
                  break;
                case "theme":
                  darkMode.toggle()
                  break;
              }
            }}>
              <Dropdown.Item color='primary' key="theme">Cambiar tema</Dropdown.Item>
              <Dropdown.Item color='error' key="logout">Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};
