import { Badge, Card, Grid, Text } from '@nextui-org/react';
import { AppGithubMeta } from '../../generated/graphql';
import { GithubIcon } from '../../ui/icons/GithubIcon';

interface AppHeaderInfoProps {
  app: {
    name: string;
    appGithubMeta?: AppGithubMeta | null;
  };
}

export const AppHeaderInfo = ({ app }: AppHeaderInfoProps) => {
  return (
    <Grid.Container>
      <Grid xs={12} md>
        <Text h2>
          {app.name}
        </Text>
      </Grid>
      <Grid xs={12} md className='flex md:justify-end'>
        {app.appGithubMeta ? (
          <Card variant='bordered' css={{ w: "auto" }}>
            <Card.Body css={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
              <div className='flex flex-row items-center'>
                <GithubIcon size={16} />
                <Text className='mx-4'>
                  {app.appGithubMeta.repoOwner}/{app.appGithubMeta.repoName}
                </Text>
                <Badge>
                  {app.appGithubMeta.branch}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ) : null}
      </Grid>
    </Grid.Container>
  );
};
