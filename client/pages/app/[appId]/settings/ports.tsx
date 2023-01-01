import { Container, Grid } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useAppByIdQuery } from '../../../../generated/graphql';
import { AdminLayout } from '../../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../../ui/modules/app/AppHeaderTabNav';
import { AppSettingsMenu } from '../../../../ui/modules/app/AppSettingsMenu';
import { AppProxyPorts } from '../../../../ui/modules/appProxyPorts/AppProxyPorts';

const AppSettingsPorts = () => {
    const history = useRouter();
    const appId = history.query.appId as string;

    const { data, loading, error } = useAppByIdQuery({
        variables: {
            appId,
        },
    });

    const app = data?.app

    return (
        <AdminLayout loading={loading} notFound={!app} error={error} pageTitle={`Puertos | ${app?.name}`}>
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
                            <AppProxyPorts appId={app.id} />
                        </Grid>
                    </Grid.Container>
                </Container>
            </>}
        </AdminLayout >
    );
};

export default AppSettingsPorts;
