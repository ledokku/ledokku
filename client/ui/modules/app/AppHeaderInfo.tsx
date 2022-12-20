import { Badge, Card, Grid, Link, Text } from '@nextui-org/react';
import { useDomainsQuery } from '../../../generated/graphql';
import { GithubIcon } from '../../../ui/icons/GithubIcon';

interface AppHeaderInfoProps {
    app: {
        id: string;
        name: string;
        appMetaGithub?: any;
    };
}

export const AppHeaderInfo = ({ app }: AppHeaderInfoProps) => {
    const {
        data: domainsData,
        loading: domainsDataLoading,
        refetch: appDomainsRefetch,
    } = useDomainsQuery({
        variables: {
            appId: app.id,
        },
    });

    return (
        <Grid.Container>
            <Grid xs={12} md>
                <Text h2>{app.name}</Text>
            </Grid>
            <Grid xs={12} md className="flex flex-col items-end">
                <Link href={`http://${domainsData?.domains?.at(0)?.domain}`} isExternal target="_blank">
                    {domainsData?.domains?.at(0)?.domain}
                </Link>
                {app.appMetaGithub ? (
                    <Link href={`https://github.com/${app.appMetaGithub.repoOwner}/${app.appMetaGithub.repoName}/tree/${app.appMetaGithub.branch}`} target="_blank">
                        <Card variant="bordered" css={{ w: 'auto', marginTop: 8 }}>
                            <Card.Body css={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
                                <div className="flex flex-row items-center">
                                    <GithubIcon size={16} />
                                    <Text className="mx-4">
                                        {app.appMetaGithub.repoOwner}/{app.appMetaGithub.repoName}
                                    </Text>
                                    <Badge>{app.appMetaGithub.branch}</Badge>
                                </div>
                            </Card.Body>
                        </Card>
                    </Link>
                ) : null}
            </Grid>
        </Grid.Container>
    );
};
