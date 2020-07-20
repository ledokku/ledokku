import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../modules/layout/Header';
import { useDatabaseByIdQuery } from '../../generated/graphql';
import { TabNav, TabNavLink, Terminal } from '../../ui';

interface LogProps {
  log: string;
}

export const LineOfLog = (props: LogProps) => (
  <React.Fragment>
    <br />
    <p className="text-green-400">{props.log}</p>
  </React.Fragment>
);

export const Logs = () => {
  const { id: databaseId } = useParams();

  const { data, loading /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
  });

  // const {
  //   data: databaseLogsData,
  //   loading: databaseLogsLoading,
  // } = useDatabaseLogsQuery({
  //   variables: {
  //     databaseId,
  //   },
  //   ssr: false,
  //   skip: !databaseId,
  //   pollInterval: 15000,
  // });

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

      {/* <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Logs</h1>
        </div>
        <Terminal className="pt-8 pb-16">
          <p className=" typing items-center ">{`Logs for ${database.name} database:`}</p>
          {!databaseLogsData && !databaseLogsLoading ? (
            <span className="text-yellow-400">Database logs loading</span>
          ) : databaseLogsLoading ? (
            'Loading...'
          ) : (
            databaseLogsData.databaseLogs.logs.map((dblog) => (
              <LineOfLog log={dblog} />
            ))
          )}
        </Terminal>
      </div> */}
    </div>
  );
};
