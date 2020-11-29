import { toast } from 'react-toastify';
import { DomainsDocument } from '../../generated/graphql';
import {
  useAppByIdQuery,
  useRemoveDomainMutation,
  useDomainsQuery,
} from '../../generated/graphql';
import { Button } from '../../ui';
import { TrashBinIcon } from '../../ui/icons/TrashBinIcon';
import { AddAppDomain } from './AddAppDomain';

interface AppDomainProps {
  appId: string;
}

export const AppDomains = ({ appId }: AppDomainProps) => {
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
      <h1 className="text-md font-bold mt-7">Domain managment</h1>
      <p className="text-gray-400 text-sm mb-2">
        List of domains you have added to {app.name} app
      </p>
      {domainsData &&
        !domainsDataLoading &&
        domainsData.domains.domains.length > 0 &&
        domainsData.domains.domains.map((domain) => (
          <>
            {domain && domain.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                <p className="text-blue-600 mt-2">{domain}</p>
                <div className="flex items-end">
                  <Button
                    isLoading={removeDomainMutationLoading}
                    className="ml-2"
                    color="red"
                    onClick={() => handleRemoveDomain(domain)}
                    variant="outline"
                    size={24}
                  >
                    <TrashBinIcon size={24} />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                Currently you haven't added any domains to your app
              </p>
            )}
          </>
        ))}
      <AddAppDomain appId={appId} appDomainsRefetch={appDomainsRefetch} />
    </>
  );
};
