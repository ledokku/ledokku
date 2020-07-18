import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../modules/layout/Header';
import { useDatabaseByIdQuery } from '../../generated/graphql';
import { TabNav, TabNavLink } from '../../ui';

export const Settings = () => {
  const { id: databaseId } = useParams();

  const { data, loading /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
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
          <TabNavLink to={`/database/${database.id}/apps`}>Apps</TabNavLink>
          <TabNavLink to={`/database/${database.id}/settings`} selected>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Settings</h1>
        </div>
        TODO ADD SETTINGS FOR DB
      </div>
    </div>
  );
};
