import { Avatar, Dropdown, Link, Navbar } from '@nextui-org/react';
import { FcIdea, FcImport } from 'react-icons/fc';
import { useLocation } from 'react-router';
import useDarkMode from 'use-dark-mode';
import { useAuth } from '../../modules/auth/AuthContext';
import { OCStudiosLogo } from '../icons/OCStudiosLogo';

export const Header = () => {
  const { user, logout } = useAuth();
  const darkMode = useDarkMode(false);
  const location = useLocation();

  const menuItems: { link: string, name: string }[] = [
    { link: '/dashboard', name: "Inicio" },
    { link: '/apps', name: "Aplicaciones" },
    { link: '/databases', name: "Bases de datos" },
    { link: '/activity', name: "Actividad" },
    { link: '/metrics', name: "Metricas" },
    { link: '/settings', name: "Configuración" },
  ];

  return (
    <Navbar variant="floating" css={{ background: "transparent" }}>
      <Navbar.Brand><Navbar.Toggle showIn="xs" className='mr-4' /><Link href='/dashboard'><OCStudiosLogo /></Link></Navbar.Brand>
      <Navbar.Content variant='underline-rounded' hideIn="xs">
        {menuItems.map(it => <Navbar.Link href={it.link} isActive={location.pathname === it.link}>{it.name}</Navbar.Link>)}
      </Navbar.Content>
      <Navbar.Collapse>
        {menuItems.map(it => <Navbar.CollapseItem><Link color="inherit" href={it.link}>{it.name}</Link></Navbar.CollapseItem>)}
      </Navbar.Collapse>
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
              <Dropdown.Item icon={<FcIdea />} color='primary' key="theme">Cambiar tema</Dropdown.Item>
              <Dropdown.Item icon={<FcImport />} color='error' key="logout">Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};
