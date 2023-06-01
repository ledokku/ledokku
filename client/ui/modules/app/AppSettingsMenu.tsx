import { Navbar } from '@nextui-org/react';
import Link from 'next/link';
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
            <Navbar.Content variant={'highlight-rounded'} className="flex flex-col gap-4 items-stretch">
                <Navbar.Item
                    className='p-4 h-fit'
                    isActive={selectedRoute === 'general'}
                >
                    <Link
                        className='text-white'
                        href={`/app/${app.id}/settings/general`}>
                        General
                    </Link>
                </Navbar.Item>
                <Navbar.Item
                    className='p-4 h-fit'
                    isActive={selectedRoute === 'ports'}
                >
                    <Link
                        className='text-white'
                        href={`/app/${app.id}/settings/ports`}>
                        Configuración de puertos
                    </Link>
                </Navbar.Item>
                <Navbar.Item
                    className='p-4 h-fit'
                    isActive={selectedRoute === 'domains'}
                >
                    <Link
                        className='text-white'
                        href={`/app/${app.id}/settings/domains`}>
                        Dominios
                    </Link>
                </Navbar.Item>

            </Navbar.Content>
        </Navbar>
    );
};
