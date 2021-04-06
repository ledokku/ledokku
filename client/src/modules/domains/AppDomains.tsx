import {
  Box,
  Flex,
  Heading,
  Link,
  Text,
  Spinner,
  Icon,
  IconButton,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { DomainsDocument } from '../../generated/graphql';
import {
  useAppByIdQuery,
  useRemoveDomainMutation,
  useDomainsQuery,
} from '../../generated/graphql';
import { AddAppDomain } from './AddAppDomain';
import { useToast } from '../../ui/toast';

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
      toast.success('Domain removed successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <>
      <Box py="5">
        <Heading as="h2" size="md">
          Domain management
        </Heading>
        <Text fontSize="sm" color="gray.400">
          List of domains you have added to {app.name} app
        </Text>
      </Box>

      <Grid templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}>
        <GridItem colSpan={2}>
          <Box mb="8">
            {domainsDataLoading ? <Spinner /> : null}
            {domainsData?.domains.domains.length === 0 ? (
              <Text fontSize="sm" color="gray.400">
                Currently you haven't added any custom domains to your app
              </Text>
            ) : null}
            {domainsData?.domains.domains.map((domain: any) => (
              <Flex
                key={domain}
                justifyContent="space-between"
                alignItems="center"
              >
                <Link
                  href={`http://${domain}`}
                  isExternal
                  display="flex"
                  alignItems="center"
                >
                  {domain} <Icon as={FiExternalLink} mx="2" />
                </Link>

                <IconButton
                  aria-label="Delete"
                  variant="ghost"
                  colorScheme="red"
                  icon={<FiTrash2 />}
                  disabled={removeDomainMutationLoading}
                  onClick={() => handleRemoveDomain(domain)}
                />
              </Flex>
            ))}
          </Box>

          <AddAppDomain appId={appId} appDomainsRefetch={appDomainsRefetch} />
        </GridItem>
      </Grid>
    </>
  );
};
