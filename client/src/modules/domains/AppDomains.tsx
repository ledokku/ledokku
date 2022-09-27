import { FiTrash2 } from 'react-icons/fi';
import { DomainsDocument } from '../../generated/graphql';
import {
  useAppByIdQuery,
  useRemoveDomainMutation,
  useDomainsQuery,
} from '../../generated/graphql';
import { AddAppDomain } from './AddAppDomain';
import { useToast } from '../../ui/toast';
import { Button, Grid, Link, Loading, Table, Text } from '@nextui-org/react';

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
    return <Loading />;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <Grid.Container gap={2}>
      <Grid xs={12} direction='column'>
        <Text h2>
          Configuración de dominios
        </Text>
        <Text>
          Lista de dominios agregados a "{app.name}"
        </Text>
      </Grid>

      <Grid xs={12} direction="column">
        {domainsData?.domains.domains.length === 0 ? (
          <Text h5>
            Actualmente no hay ningún dominio asignado
          </Text>
        ) : (<Table width="100%">
          <Table.Header>
            <Table.Column >URL</Table.Column>
            <Table.Column width={100}>Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {domainsData?.domains.domains.map((domain: any) => (
              <Table.Row>
                <Table.Cell>
                  <Link
                    href={`http://${domain}`}
                    isExternal

                  >
                    {domain}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="error"
                    flat
                    css={{ minWidth: "auto" }}
                    aria-label="Delete"
                    icon={<FiTrash2 />}
                    disabled={removeDomainMutationLoading}
                    onClick={() => handleRemoveDomain(domain)}
                  />
                </Table.Cell>
              </Table.Row>

            )) ?? []}
          </Table.Body>
        </Table>)}
        <div className='mt-8'>
          <AddAppDomain appId={appId} appDomainsRefetch={appDomainsRefetch} />
        </div>
      </Grid>
    </Grid.Container>
  );
};
