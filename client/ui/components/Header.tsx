import { Avatar, Dropdown, Navbar, useTheme } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useId } from 'react';
import { FcIdea, FcImport } from 'react-icons/fc';
import { OCStudiosLogo } from '../icons/OCStudiosLogo';
import { useAuth } from '../modules/auth/AuthContext';

export const Header = () => {
    const location = useRouter();
    const { user, logout } = useAuth();
    const { setTheme } = useNextTheme();
    const { isDark, theme } = useTheme();

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
                <Navbar.Toggle showIn="sm" className="mr-4" />
                <Link href="/dashboard">
                    <OCStudiosLogo />
                </Link>
            </Navbar.Brand>
            <Navbar.Content variant="underline-rounded" hideIn="xs">
                {menuItems.map((it, index) => {
                    const id = useId();
                    return (
                        <Navbar.Link
                            id={id}
                            key={index}
                            isActive={location.pathname === it.link}
                            href={it.link}
                        >
                            {it.name}
                        </Navbar.Link>
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
                                src={user?.avatarUrl}
                                size="sm"
                                className="mr-2"
                                bordered
                                color="default"
                            />{' '}
                            {user?.userName}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            onAction={(key) => {
                                switch (key) {
                                    case 'logout':
                                        logout();
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
