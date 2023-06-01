import { DashboardQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Button, Card, Grid, Image, Spacer, Text } from '@nextui-org/react';
import format from 'date-fns/format';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useGetBuildingAppsQuery } from '../generated/graphql';
import { BuildingAlert } from '../ui/components/BuildingAlert';
import { DbIcon } from '../ui/components/DbIcon';
import { GithubIcon } from '../ui/icons/GithubIcon';
import { AdminLayout } from '../ui/layout/layout';
import { ActivityFeed } from '../ui/modules/activity/ActivityFeed';

interface DashboardProps {
    data: DashboardQuery;
}

const Dashboard = ({ data }: DashboardProps) => {
    const router = useRouter();

    const { data: buildingApps, startPolling } = useGetBuildingAppsQuery({
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        startPolling(2000);
    }, [startPolling]);

    return (
        <AdminLayout>
            <div className='flex flex-col gap-2'>
                {buildingApps && buildingApps.buildingApps.map((it, index) => <BuildingAlert key={index} app={it as any} />)}
                {buildingApps && buildingApps.buildingApps.length > 0 && <Spacer />}
            </div>
            <div className="w-full flex flex-col md:flex-row justify-end mb-8 items-end">
                <Button
                    bordered
                    className="mr-0 md:mr-4 mb-4 md:mb-0"
                    onClick={() => {
                        router.push('/create-database');
                    }}
                >
                    Crear base de datos
                </Button>
                <Button
                    onClick={() => {
                        router.push('/app-creation/create-app');
                    }}
                >
                    Crear aplicación
                </Button>
            </div>

            <Grid.Container as="main" gap={3}>
                <Grid xs={12} md={7} className="flex flex-col">
                    <Text h2>Aplicaciones</Text>
                    {data?.apps.items.length === 0 ? <Text h4 color='gray'>Sin aplicaciones</Text> : null}
                    <Grid.Container gap={1}>
                        {data?.apps.items.map((app, index) => (
                            <Grid xs={12} sm={6} key={index}>
                                <Link href={`/app/${app.id}`} className="w-full">
                                    <Card isHoverable isPressable className="w-full">
                                        <Card.Header>
                                            <div
                                                style={{
                                                    width: 'auto',
                                                    height: 'auto',
                                                    padding: '0.3rem',
                                                }}
                                                className="border-2 rounded-lg"
                                            >
                                                {app.appMetaGithub ? (
                                                    <div style={{ width: 40, height: 40 }}>
                                                        <GithubIcon size={40} />
                                                    </div>
                                                ) : (
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        objectFit="cover"
                                                        src="/dokku.png"
                                                        alt="dokkuLogo"
                                                    />
                                                )}
                                            </div>
                                            <Grid.Container css={{ pl: '$6' }}>
                                                <Grid xs={12}>
                                                    <Text h4 css={{ lineHeight: '$xs' }}>
                                                        {app.name}
                                                    </Text>
                                                </Grid>
                                                <Grid xs={12}>
                                                    <Text css={{ color: '$accents8' }} small>
                                                        {app.id}
                                                    </Text>
                                                </Grid>
                                            </Grid.Container>
                                        </Card.Header>
                                        <Card.Body css={{ py: '$2' }}>
                                            <Text>
                                                {app.appMetaGithub
                                                    ? `${app.appMetaGithub.repoOwner}/${app.appMetaGithub.repoName}`
                                                    : ''}
                                            </Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Text h6 className="mb-1">
                                                Creado el{' '}
                                                {format(new Date(app.createdAt), 'dd/MM/yyyy')}
                                            </Text>
                                        </Card.Footer>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid.Container>

                    <Text h2 className="mt-8">
                        Bases de datos
                    </Text>
                    {data?.databases.items.length === 0 ? (
                        <Text h4 color='gray'>Sin bases de datos</Text>
                    ) : (
                        <Grid.Container gap={1}>
                            {data?.databases.items.map((database, index) => {
                                return (
                                    <Grid xs={12} sm={6} key={index}>
                                        <Link href={`/database/${database.id}`} className="w-full">
                                            <Card isHoverable isPressable className="w-full">
                                                <Card.Header>
                                                    <div
                                                        style={{
                                                            width: 'auto',
                                                            height: 'auto',
                                                            padding: '0.3rem',
                                                        }}
                                                        className="border-2 rounded-lg"
                                                    >
                                                        <div style={{ width: 40, height: 40 }}>
                                                            <DbIcon
                                                                database={database.type}
                                                                size={40}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Grid.Container css={{ pl: '$6' }}>
                                                        <Grid xs={12}>
                                                            <Text h4 css={{ lineHeight: '$xs' }}>
                                                                {database.name}
                                                            </Text>
                                                        </Grid>
                                                        <Grid xs={12}>
                                                            <Text
                                                                css={{ color: '$accents8' }}
                                                                small
                                                            >
                                                                {database.id}
                                                            </Text>
                                                        </Grid>
                                                    </Grid.Container>
                                                </Card.Header>
                                                <Card.Footer>
                                                    <Text h6 className="mb-1">
                                                        Creado el{' '}
                                                        {format(
                                                            new Date(database.createdAt),
                                                            'dd/MM/yyyy'
                                                        )}
                                                    </Text>
                                                </Card.Footer>
                                            </Card>
                                        </Link>
                                    </Grid>
                                );
                            })}
                        </Grid.Container>
                    )}
                </Grid>

                <Grid xs={12} md={5} className="flex flex-col">
                    <Text h2 className="mb-8">
                        Última actividad
                    </Text>
                    <ActivityFeed isSinglePage={true} />
                </Grid>
            </Grid.Container>
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession({ ctx });

    const data = await serverClient.dashboard({
        appLimit: 4,
        databaseLimit: 4,
    }, {
        Authorization: `Bearer ${session?.accessToken}`,
    });

    return {
        props: {
            data: data,
        }
    }
}

export default Dashboard;