import { Container, Image, useTheme } from '@nextui-org/react';
import { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import dynamic from 'next/dynamic';
const Header = dynamic(async () => (await import('../components/Header')).Header, { ssr: false });

interface AdminLayoutProps {
    children?: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { isDark } = useTheme();

    return (
        <>
            <div className="blur-3xl absolute w-full" style={{ zIndex: -10, filter: 'blur(64px)' }}>
                <Image
                    src={isDark ? '/bg_dark.jpg' : '/bg_light.jpg'}
                    height="15vh"
                    objectFit="cover"
                    alt="background"
                />
            </div>
            <div className="flex flex-col" style={{ minHeight: '100vh' }}>
                <Header />
                <Container className="py-16" id="container-up">
                    {children}
                </Container>
                <div className="flex-grow" />
                <Footer />
            </div>
        </>
    );
};

export const withAdminLayout = (element: JSX.Element) => {
    return <AdminLayout>{element}</AdminLayout>;
};
