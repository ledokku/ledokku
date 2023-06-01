import { Navbar } from '@nextui-org/react';
import Link from 'next/link';
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
            ? 'env' :
            location.pathname.endsWith('/activity')
                ? 'activity'
                : location.pathname.endsWith('/settings/ports') ||
                    location.pathname.endsWith('/settings/domains') ||
                    location.pathname.endsWith('/settings/general')
                    ? 'settings'
                    : 'index';

    return (
        <Navbar disableShadow className='overflow-auto'>
            <Navbar.Content variant="underline-rounded" className='[&>*>*]:text-inherit'>
                <Navbar.Item isActive={selectedRoute === 'index'}>
                    <Link href={`/app/${app.id}`}>
                        Aplicación
                    </Link>
                </Navbar.Item>
                <Navbar.Item isActive={selectedRoute === 'logs'}>
                    <Link href={`/app/${app.id}/logs`}>
                        Registros de ejecución
                    </Link>
                </Navbar.Item>
                <Navbar.Item isActive={selectedRoute === 'activity'} >
                    <Link href={`/app/${app.id}/activity`}>
                        Actividad
                    </Link>
                </Navbar.Item>
                <Navbar.Item isActive={selectedRoute === 'env'} >
                    <Link href={`/app/${app.id}/env`}>
                        Variables de entorno
                    </Link>
                </Navbar.Item>
                <Navbar.Item
                    isActive={selectedRoute === 'settings'}
                >
                    <Link href={`/app/${app.id}/settings/general`}>
                        Configuración
                    </Link>
                </Navbar.Item>
            </Navbar.Content>
        </Navbar>
    );
};
