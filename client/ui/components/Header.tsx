import { Avatar, Dropdown, Navbar, useTheme } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme as useNextTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FcIdea, FcImport } from 'react-icons/fc';
import { OCStudiosLogo } from '../icons/OCStudiosLogo';

export const Header = () => {
    const location = useRouter();
    const { setTheme } = useNextTheme();
    const { isDark } = useTheme();
    const { data } = useSession();

    const user = data?.user;

    const menuItems: { link: string; name: string }[] = [
        { link: '/dashboard', name: 'Inicio' },
        { link: '/apps', name: 'Aplicaciones' },
        { link: '/databases', name: 'Bases de datos' },
        { link: '/activity', name: 'Actividad' },
        { link: '/metrics', name: 'Metricas' },
        { link: '/settings', name: 'Configuración' },
    ];

    return (
        <Navbar
            variant="floating"
            css={{ background: 'transparent' }}
            suppressHydrationWarning={true}
        >
            <Navbar.Brand>
                <Navbar.Toggle showIn="md" className="mr-4" />
                <Link href="/dashboard">
                    <OCStudiosLogo />
                </Link>
            </Navbar.Brand>
            <Navbar.Content variant="underline-rounded" hideIn="md">
                {menuItems.map((it, index) => {
                    return (
                        <Navbar.Item
                            key={index}
                            isActive={location.pathname === it.link}
                        >
                            <Link href={it.link} className='text-inherit'>
                                {it.name}
                            </Link>
                        </Navbar.Item>
                    );
                })}
            </Navbar.Content>
            <Navbar.Collapse>
                {menuItems.map((it, index) => (
                    <Navbar.CollapseItem key={index} isActive={location.pathname === it.link}>
                        <Link color="inherit" href={it.link}>
                            <span>{it.name}</span>
                        </Link>
                    </Navbar.CollapseItem>
                ))}
            </Navbar.Collapse>
            <Navbar.Content>
                <Navbar.Item>
                    <Dropdown>
                        <Dropdown.Button light>
                            <Avatar
                                src={user?.image ?? ""}
                                size="sm"
                                className="mr-2"
                                bordered
                                color="default"
                            />{' '}
                            {user?.name}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            onAction={(key) => {
                                switch (key) {
                                    case 'logout':
                                        signOut({
                                            callbackUrl: '/',
                                            redirect: true
                                        });
                                        break;
                                    case 'theme':
                                        setTheme(!isDark ? 'dark' : 'light');
                                        break;
                                }
                            }}
                        >
                            <Dropdown.Item icon={<FcIdea />} color="primary" key="theme">
                                Cambiar tema
                            </Dropdown.Item>
                            <Dropdown.Item icon={<FcImport />} color="error" key="logout">
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Item>
            </Navbar.Content>
        </Navbar>
    );
};
