import { AppByIdQuery, AppProxyPortsQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Container, Grid } from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { AdminLayout } from '../../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../../ui/modules/app/AppHeaderTabNav';
import { AppSettingsMenu } from '../../../../ui/modules/app/AppSettingsMenu';
import { AppProxyPorts } from '../../../../ui/modules/appProxyPorts/AppProxyPorts';

interface AppSettingsPortsProps {
    app: AppByIdQuery['app'];
    ports: AppProxyPortsQuery['appProxyPorts'];
}

const AppSettingsPorts = ({ app, ports }: AppSettingsPortsProps) => {
    return (
        <AdminLayout pageTitle={`Puertos | ${app?.name}`}>
            {app && <> <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>

                <Container className="mt-4">
                    <Grid.Container gap={4}>
                        <Grid xs={3}>
                            <AppSettingsMenu app={app} />
                        </Grid>
                        <Grid xs={9}>
                            <AppProxyPorts app={app as any} ports={ports} />
                        </Grid>
                    </Grid.Container>
                </Container>
            </>}
        </AdminLayout >
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    const res = await serverClient.appById({
        appId: ctx.params?.appId as string
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    });

    const ports = await serverClient.appProxyPorts({
        appId: ctx.params?.appId as string,
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    });


    return {
        props: {
            app: res.app,
            ports: ports.appProxyPorts
        }
    }
}

export default AppSettingsPorts;
