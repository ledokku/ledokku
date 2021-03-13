import { useAppByIdQuery } from '../../generated/graphql';

import { Grid, GridItem, Text, Link, Heading } from '@chakra-ui/react';
import { config } from '../../config';
import { useState } from 'react';

interface AppDomainProps {
  appId: string;
}

export const Webhooks = ({ appId }: AppDomainProps) => {
  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });
  const [isSecretVisible, setIsSecretVisible] = useState(false);

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
      <Heading size="sm" className="text-md font-bold pb-1 py-5">
        Github webhooks secret
      </Heading>

      <Text color="gray.400" fontSize="sm">
        Use this secret when setting up wehbooks for current app
      </Text>
      <Grid templateColumns="repeat(5, 1fr)" gap={1}>
        <GridItem colSpan={2} pt={3}>
          <Text>
            {isSecretVisible
              ? data?.app?.githubRepoId + config.githubClientId.slice(0, 4)
              : '*************'}
          </Text>
        </GridItem>
        <GridItem colSpan={2} ml={-6}>
          <svg
            onClick={() => setIsSecretVisible(!isSecretVisible)}
            className={
              isSecretVisible
                ? 'fill-current text-red-500 h-8 w-8 mt-2 -ml-1.5 mr-5 mb-2'
                : 'fill-current text-gray-900 h-8 w-8 mt-2 -ml-1.5 mr-5 mb-2'
            }
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M.2 10a11 11 0 0 1 19.6 0A11 11 0 0 1 .2 10zm9.8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
        </GridItem>
      </Grid>
      <Text color="gray.400" fontSize="sm">
        For more info head to{' '}
        <Link color="blue.400" href="https://ledokku.com" isExternal>
          Webhooks setup guide
        </Link>
      </Text>
    </>
  );
};
