import { Badge, Card, Container, Grid, Text } from '@nextui-org/react';
import { AppMetaGithub } from '../../generated/graphql';
import { GithubIcon } from '../../ui/icons/GithubIcon';

interface AppHeaderInfoProps {
  app: {
    name: string;
    appMetaGithub?: AppMetaGithub | null;
  };
}

export const AppHeaderInfo = ({ app }: AppHeaderInfoProps) => {
  return (
    <Container className='mt-8'>
      <Grid.Container>
        <Grid xs={12} md>
          <Text h2>
            {app.name}
          </Text>
        </Grid>
        <Grid xs={12} md className='flex md:justify-end'>
          {app.appMetaGithub ? (
            <Card variant='bordered' css={{ w: "auto" }}>
              <Card.Body css={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
                <div className='flex flex-row items-center'>
                  <GithubIcon size={16} />
                  <Text className='mx-4'>
                    {app.appMetaGithub.repoOwner}/{app.appMetaGithub.repoName}
                  </Text>
                  <Badge>
                    {app.appMetaGithub.branch}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          ) : null}
        </Grid>
      </Grid.Container>
    </Container>
  );
};
