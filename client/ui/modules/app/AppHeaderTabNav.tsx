import { Navbar } from '@nextui-org/react';
import { useRouter } from 'next/router';

interface AppHeaderTabNavProps {
    app: {
        id: string;
    };
}

export const AppHeaderTabNav = ({ app }: AppHeaderTabNavProps) => {
    const location = useRouter();

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
        <Navbar disableShadow>
            <Navbar.Content variant="underline-rounded">
                <Navbar.Link isActive={selectedRoute === 'index'} href={`/app/${app.id}`}>
                    Aplicación
                </Navbar.Link>
                <Navbar.Link isActive={selectedRoute === 'logs'} href={`/app/${app.id}/logs`}>
                    Registros
                </Navbar.Link>
                <Navbar.Link isActive={selectedRoute === 'env'} href={`/app/${app.id}/env`}>
                    Variables de entorno
                </Navbar.Link>
                <Navbar.Link
                    isActive={selectedRoute === 'settings'}
                    href={`/app/${app.id}/settings/ports`}
                >
                    Configuración
                </Navbar.Link>
            </Navbar.Content>
        </Navbar>
    );
};
