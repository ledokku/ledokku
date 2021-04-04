import { Container, Grid, GridItem } from '@chakra-ui/layout';
import { useParams } from 'react-router';
import { useAppByIdQuery } from '../../../generated/graphql';
import { AppHeaderInfo } from '../../../modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../modules/app/AppHeaderTabNav';
import { AppSettingsMenu } from '../../../modules/app/AppSettingsMenu';
import { AppDomains } from '../../../modules/domains/AppDomains';
import { Header } from '../../../modules/layout/Header';
import { HeaderContainer } from '../../../ui';

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
      <HeaderContainer>
        <Header />
        <AppHeaderInfo app={app} />
        <AppHeaderTabNav app={app} />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Grid
          templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(6, 1fr)' }}
          gap={{ sm: 0, md: 16 }}
        >
          <GridItem colSpan={2} py={5}>
            <AppSettingsMenu app={app} />
          </GridItem>
          <GridItem colSpan={4}>
            <AppDomains appId={appId} />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};
