import React from 'react';
import { Header } from '../../modules/layout/Header';
import { useDatabaseByIdQuery } from '../../generated/graphql';
import { useParams } from 'react-router-dom';
import { TabNav, TabNavLink, Terminal } from '../../ui';

export const Database = () => {
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
    return <p>Database not found.</p>;
  }

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/database/${database.id}`} selected>
            Database
          </TabNavLink>

          <TabNavLink to={`/database/${database.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/database/${database.id}/settings`}>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <div>
            <h1 className="text-lg font-bold py-5">Database info</h1>
            <div className="mt-3 bg-gray-100 shadow overflow-hidden rounded-lg border-b border-gray-200">
              <table className="mt-4 mb-4 min-w-full bg-white">
                <tbody className="text-gray-700">
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      Database name
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">
                      {database.name}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      id
                    </td>
                    <td className="w-3/4 text-left py-3 px-4">{database.id}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="w-1/3 text-left py-3 px-4 font-semibold">
                      Type
                    </td>
                    <td className="w-1/3 text-left py-3 px-4">
                      {database.type}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full">
            <h1 className="font-bold text-lg font-bold py-5">Apps</h1>
            <div className="mt-4 mb-4">
              <h2 className="text-gray-400">
                {`Here you can modify apps linked to:`}
                <span className="text-gray-900"> {database.name}</span> database
              </h2>
            </div>
            <button className="mt-4 bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white py-2 px-4 border hover:border-transparent rounded-lg">
              Connect app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
