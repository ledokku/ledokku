import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../modules/layout/Header';
import {
  useDatabaseByIdQuery,
  useDatabaseLogsQuery,
} from '../../generated/graphql';
import {
  TabNav,
  TabNavLink,
  Terminal,
  Alert,
  AlertDescription,
} from '../../ui';

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
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/database/${database.id}`}>Database</TabNavLink>
          <TabNavLink to={`/database/${database.id}/logs`} selected>
            Logs
          </TabNavLink>
          <TabNavLink to={`/database/${database.id}/settings`}>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Logs for {database.name}:</h1>
        </div>

        {databaseLogsLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : null}

        {databaseLogsError ? (
          <Alert status="error">
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
      </div>
    </div>
  );
};
