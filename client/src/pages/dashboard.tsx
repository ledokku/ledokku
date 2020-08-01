import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardQuery } from '../generated/graphql';
import { Header } from '../modules/layout/Header';
import { Footer } from '../modules/layout/Footer';
import { TabNav, TabNavLink, Button } from '../ui';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';

export const Dashboard = () => {
  // const history = useHistory();
  const { data /* loading, error */ } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  // TODO if no apps or dbs show onboarding screen

  return (
    <div className="h-screen flex justify-between flex-col">
      <div>
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabNav>
            <TabNavLink to="/dashboard" selected>
              Dashboard
            </TabNavLink>
            <TabNavLink to="/activity">Activity</TabNavLink>
            <TabNavLink to="/metrics">Metrics</TabNavLink>
            <TabNavLink to="/settings">Settings</TabNavLink>
          </TabNav>
        </div>

        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end pb-6">
            <Link to="/create-database">
              <Button color={'grey'} variant="outline" className="text-sm mr-3">
                Create database
              </Button>
            </Link>
            <Link to="/create-app">
              <Button color={'grey'} className="text-sm">
                Create app
              </Button>
            </Link>
          </div>
          <main className="grid grid-cols-12 col-gap-20">
            <div className="col-span-7 mt-4">
              <h1 className="text-lg font-bold py-2">Apps</h1>
              {data?.apps.map((app) => (
                <div key={app.id} className="mt-3">
                  <div className="mb-1 text-gray-900 font-medium">
                    <Link to={`/app/${app.id}`}>
                      <div>{app.name}</div>
                    </Link>
                  </div>
                  <div className="flex justify-between text-gray-400 mb-3 text-sm">
                    <div>ledokku/ledokku</div>
                    <div>Last deploy 6h ago</div>
                  </div>
                  <div className="border-b border-gray-200" />
                </div>
              ))}

              <h1 className="text-lg font-bold py-5">Databases</h1>
              {data?.databases.map((database) => (
                <div key={database.id}>
                  <Link to={`/database/${database.id}`} className="py-2 block">
                    <div className="flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                      <PostgreSQLIcon size={24} className="mr-2" />
                      <p>{database.name}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="col-span-5 mt-4">
              <h1 className="text-lg font-bold py-5">Latest activity</h1>
              <p className="text-gray-400 text-sm">Coming soon</p>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};
