import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../modules/layout/Header';
import { useAppByIdQuery } from '../../generated/graphql';
import { TabNav, TabNavLink } from '../../ui';

export const Databases = () => {
  const { id: appId } = useParams();

  const { data, loading, error } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

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
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/app/${app.id}`}>App</TabNavLink>
          <TabNavLink to={`/app/${app.id}/databases`} selected>
            Databases
          </TabNavLink>
          <TabNavLink to={`/app/${app.id}/env`}>Env setup</TabNavLink>
          <TabNavLink to={`/app/${app.id}/settings`}>Settings</TabNavLink>
          <TabNavLink to="/dashboard">Return to dashboard</TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Databases</h1>
        </div>
        <div className="mt-4 mb-4">
          <h2 className="text-gray-400">
            {`Here you can modify databases linked to:`}
            <span className="text-gray-900"> {app.name}</span> app
          </h2>
        </div>
        <button className="mt-4 bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg">
          Connect database
        </button>
      </div>
    </div>
  );
};
