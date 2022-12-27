import { Button, Grid, Link, Table, Text } from '@nextui-org/react';
import { FiTrash2 } from 'react-icons/fi';
import {
    DomainsDocument,
    useAppByIdQuery,
    useDomainsQuery,
    useRemoveDomainMutation
} from '../../../generated/graphql';
import { LoadingSection } from '../../../ui/components/LoadingSection';
import { UrlStatus } from '../../components/UrlStatus';
import { useToast } from '../../toast';
import { AddAppDomain } from './AddAppDomain';

interface AppDomainProps {
    appId: string;
}

export const AppDomains = ({ appId }: AppDomainProps) => {
    const toast = useToast();
    const { data, loading /* error */ } = useAppByIdQuery({
        variables: {
            appId,
        },
        ssr: false,
        skip: !appId,
    });

    const {
        data: domainsData,
        loading: domainsDataLoading,
        refetch: appDomainsRefetch,
    } = useDomainsQuery({
        variables: {
            appId,
        },
    });

    const [
        removeDomainMutation,
        { loading: removeDomainMutationLoading },
    ] = useRemoveDomainMutation();

    const handleRemoveDomain = async (domain: string) => {
        try {
            await removeDomainMutation({
                variables: {
                    input: {
                        appId,
                        domainName: domain,
                    },
                },
                refetchQueries: [{ query: DomainsDocument, variables: { appId } }],
            });
            toast.success('Dominio eliminado');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!data) {
        return null;
    }

    // // TODO display error

    if (loading || domainsDataLoading) {
        // TODO nice loading
        return <LoadingSection />;
    }

    const { app } = data;

    if (!app) {
        // TODO nice 404
        return <p>App not found.</p>;
    }

    return (
        <Grid.Container gap={2}>
            <Grid xs={12} direction="column">
                <Text h3>Configuración de dominios</Text>
                <Text>Lista de dominios agregados a &quot;{app.name}&quot;</Text>
            </Grid>

            <Grid xs={12} direction="column">
                {domainsData?.domains.length === 0 ? (
                    <Text h5>Actualmente no hay ningún dominio asignado</Text>
                ) : (
                    <Table width="100%">
                        <Table.Header>
                            <Table.Column width={175}>Status</Table.Column>
                            <Table.Column width={175}>SSL</Table.Column>
                            <Table.Column>URL</Table.Column>
                            <Table.Column width={70}>Acciones</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {domainsData?.domains.map((it, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        <UrlStatus url={`http://${it.domain}`} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <UrlStatus url={`https://${it.domain}`} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link href={`http://${it.domain}`} isExternal target="_blank">
                                            {it.domain}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {it.domain !== `${app.name}.on.ocstudios.mx` && <Button
                                            color="error"
                                            flat
                                            css={{ minWidth: 'auto' }}
                                            aria-label="Delete"
                                            icon={<FiTrash2 />}
                                            disabled={removeDomainMutationLoading}
                                            onClick={() => handleRemoveDomain(it.domain)}
                                        />}
                                    </Table.Cell>
                                </Table.Row>
                            )) ?? []}
                        </Table.Body>
                    </Table>
                )}
                <div className="mt-8">
                    <AddAppDomain appId={appId} appDomainsRefetch={appDomainsRefetch} />
                </div>
            </Grid>
        </Grid.Container>
    );
};
