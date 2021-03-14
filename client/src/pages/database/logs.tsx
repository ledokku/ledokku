import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  Container,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Header } from '../../modules/layout/Header';
import {
  useDatabaseByIdQuery,
  useDatabaseLogsQuery,
} from '../../generated/graphql';
import { Terminal, HeaderContainer } from '../../ui';
import { DatabaseHeaderInfo } from '../../modules/database/DatabaseHeaderInfo';
import { DatabaseHeaderTabNav } from '../../modules/database/DatabaseHeaderTabNav';

export const Logs = () => {
  const { id: databaseId } = useParams<{ id: string }>();

  const { data, loading /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
  });

  const {
    data: databaseLogsData,
    error: databaseLogsError,
    loading: databaseLogsLoading,
  } = useDatabaseLogsQuery({
    variables: {
      databaseId,
    },
    pollInterval: 15000,
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { database } = data;

  if (!database) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <div>
      <HeaderContainer>
        <Header />
        <DatabaseHeaderInfo database={database} />
        <DatabaseHeaderTabNav database={database} />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Heading as="h2" size="md" py={5}>
          Logs
        </Heading>

        {databaseLogsLoading ? (
          <Text fontSize="sm" color="gray.400">
            Loading...
          </Text>
        ) : null}

        {databaseLogsError ? (
          <Alert
            status="error"
            variant="top-accent"
            borderBottomRadius="base"
            boxShadow="md"
          >
            <AlertDescription>{databaseLogsError.message}</AlertDescription>
          </Alert>
        ) : null}

        {!databaseLogsLoading && !databaseLogsError && databaseLogsData ? (
          <Terminal className="mb-8">
            {databaseLogsData.databaseLogs.logs.map((dblog, index) => (
              <React.Fragment key={index}>
                {dblog ? <p>{dblog}</p> : <p>&nbsp;</p>}
              </React.Fragment>
            ))}
          </Terminal>
        ) : null}
      </Container>
    </div>
  );
};
