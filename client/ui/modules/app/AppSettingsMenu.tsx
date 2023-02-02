import { Navbar } from '@nextui-org/react';
import { useRouter } from 'next/router';

interface AppSettingsMenuProps {
    app: {
        id: string;
    };
}

export const AppSettingsMenu = ({ app }: AppSettingsMenuProps) => {
    const location = useRouter();

    const selectedRoute = location.pathname.endsWith('/settings/ports')
        ? 'ports'
        : location.pathname.endsWith('/settings/domains')
            ? 'domains'
            : location.pathname.endsWith('/settings/general')
                ? 'general'
                : 'index';

    return (
        <Navbar disableShadow css={{ maxH: 'inherit', display: 'block' }}>
            <Navbar.Content variant={'highlight-rounded'} className="flex flex-col gap-4">
                <Navbar.Link
                    css={{ padding: 16 }}
                    isActive={selectedRoute === 'general'}
                    href={`/app/${app.id}/settings/general`}
                >
                    General
                </Navbar.Link>
                <Navbar.Link
                    css={{ padding: 16 }}
                    isActive={selectedRoute === 'ports'}
                    href={`/app/${app.id}/settings/ports`}
                >
                    Configuración de puertos
                </Navbar.Link>
                <Navbar.Link
                    css={{ padding: 16 }}
                    isActive={selectedRoute === 'domains'}
                    href={`/app/${app.id}/settings/domains`}
                >
                    Dominios
                </Navbar.Link>

            </Navbar.Content>
        </Navbar>
    );
};
