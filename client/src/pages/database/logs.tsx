import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useDatabaseByIdQuery,
  useDatabaseLogsQuery,
} from '../../generated/graphql';
import { Terminal } from '../../ui/components/Terminal';
import { DatabaseHeaderInfo } from '../../modules/database/DatabaseHeaderInfo';
import { DatabaseHeaderTabNav } from '../../modules/database/DatabaseHeaderTabNav';
import { Loading, Text } from '@nextui-org/react';
import { Alert } from '../../ui/components/Alert';
import { LoadingSection } from '../../ui/components/LoadingSection';

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
    <>
      <div>
        <DatabaseHeaderInfo database={database} />
        <DatabaseHeaderTabNav database={database} />
      </div>
      <Text h3 className='my-8'>
        Registros de la base de datos "{database.name}":
      </Text>

      {databaseLogsLoading ? (
        <LoadingSection />
      ) : null}

      {databaseLogsError ? (
        <Alert
          type="error"
          message={databaseLogsError.message}
        />
      ) : null}

      {!databaseLogsLoading && !databaseLogsError && databaseLogsData ? (
        <Terminal>
          {databaseLogsData.databaseLogs.logs.map((dblog, index) => (
            <React.Fragment key={index}>
              {dblog ? <p>{dblog}</p> : <p>&nbsp;</p>}
            </React.Fragment>
          ))}
        </Terminal>
      ) : null}
    </>
  );
};
