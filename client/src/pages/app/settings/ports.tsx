import { Container, Grid, Loading } from '@nextui-org/react';
import { useParams } from 'react-router';
import { useAppByIdQuery } from '../../../generated/graphql';
import { AppHeaderInfo } from '../../../modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../modules/app/AppHeaderTabNav';
import { AppSettingsMenu } from '../../../modules/app/AppSettingsMenu';
import { AppProxyPorts } from '../../../modules/appProxyPorts/AppProxyPorts';
import { LoadingSection } from '../../../ui/components/LoadingSection';

export const AppSettingsPorts = () => {
  const { id: appId } = useParams<{ id: string }>();

  const { data, loading } = useAppByIdQuery({
    variables: {
      appId,
    },
  });

  // TODO display error

  if (loading) {
    return <LoadingSection />;
  }

  if (!data?.app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  const { app } = data;

  return (
    <>
      <div>
        <AppHeaderInfo app={app} />
        <AppHeaderTabNav app={app} />
      </div>

      <Container className='mt-4'>
        <Grid.Container
          gap={4}>
          <Grid xs={3}>
            <AppSettingsMenu app={app} />
          </Grid>
          <Grid xs={9}>
            <AppProxyPorts appId={app.id} />
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
};
