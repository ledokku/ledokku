import { ApolloError } from '@apollo/client';
import { Card, Container, Image, Text, useTheme } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import TinyCrossfade from 'react-tiny-crossfade';
import { Footer } from '../components/Footer';
import { LoadingSection } from '../components/LoadingSection';
import { NotFound } from '../components/NotFound';
const Header = dynamic(async () => (await import('../components/Header')).Header, { ssr: false });

interface AdminLayoutProps {
    loading?: boolean;
    error?: Error | ApolloError;
    children?: ReactNode;
    notFound?: boolean
}

export const AdminLayout = ({ children, loading, error, notFound }: AdminLayoutProps) => {
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
                <Container className="py-16" lg>
                    <TinyCrossfade disableInitialAnimation duration={300} className="component-wrapper">
                        {loading ? <LoadingSection key="loading" /> : error ? <Card key="error" className='bg-red-500 max-w-[500px] mx-auto'>
                            <div className='px-4 py-2 text-white'>
                                <Text h3 className='text-white'>{error instanceof ApolloError ? error.name : "Error"}</Text>
                                {error.message}
                            </div>
                        </Card> : notFound ? <NotFound key="notFound" /> : <div key="content">{children}</div>}
                    </TinyCrossfade>
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
