import { Container, Grid } from '@nextui-org/react';
import { useParams } from 'react-router';
import { useAppByIdQuery } from '../../../generated/graphql';
import { AppHeaderInfo } from '../../../modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../modules/app/AppHeaderTabNav';
import { AppSettingsMenu } from '../../../modules/app/AppSettingsMenu';
import { AppDomains } from '../../../modules/domains/AppDomains';

export const AppSettingsDomains = () => {
  const { id: appId } = useParams<{ id: string }>();

  const { data, loading } = useAppByIdQuery({
    variables: {
      appId,
    },
  });

  // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
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
          gap={4}
        >
          <Grid xs={3}>
            <AppSettingsMenu app={app} />
          </Grid>
          <Grid xs={9}>
            <AppDomains appId={appId} />
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
};
