import { Navbar } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface DatabaseHeaderTabNavProps {
    database: {
        id: string;
    };
}

export const DatabaseHeaderTabNav = ({ database }: DatabaseHeaderTabNavProps) => {
    const location = useRouter();

    const selectedRoute = location.pathname.endsWith('/settings')
        ? 'settings'
        : location.pathname.endsWith('/logs')
            ? 'logs'
            : 'index';

    return (
        <Navbar disableShadow className="z-0">
            <Navbar.Content variant="underline-rounded" className='[&>*>*]:text-inherit'>
                <Navbar.Item isActive={selectedRoute === 'index'}>
                    <Link href={`/database/${database.id}`}>
                        Base de datos
                    </Link>
                </Navbar.Item>

                <Navbar.Item
                    isActive={selectedRoute === 'logs'}
                >
                    <Link href={`/database/${database.id}/logs`}>
                        Registros
                    </Link>
                </Navbar.Item>
                <Navbar.Item
                    isActive={selectedRoute === 'settings'}
                >
                    <Link href={`/database/${database.id}/settings`}>
                        Configuración
                    </Link>
                </Navbar.Item>
            </Navbar.Content>
        </Navbar>
    );
};
