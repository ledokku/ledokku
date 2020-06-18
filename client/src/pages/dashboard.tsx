import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardQuery } from '../generated/graphql';
import { NodeIcon } from '../ui/icons/NodeIcon';
import { Header } from '../modules/layout/Header';
import { TabNav, TabNavLink, Button } from '../ui';

export const Dashboard = () => {
  // const history = useHistory();
  const { data /* loading, error */ } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  // const handleCreateFirstApp = () => {
  //   history.push('/onboarding/cloud-provider');
  // };

  return (
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
        <main className="grid grid-cols-12 col-gap-20">
          <div className="col-span-7 mt-4">
            <h1 className="text-lg font-bold py-5 ">Apps</h1>
            {data?.apps.map((app) => (
              <div key={app.id}>
                <Link to={`/app/${app.id}`} className="py-2 block">
                  <div className="flex items-center py-3 px-2 shadow hover:shadow-md transition-shadow duration-100 ease-in-out rounded bg-white">
                    <NodeIcon size={20} className="mr-2" /> {app.name}
                  </div>
                </Link>
              </div>
            ))}
            <p className="py-3">
              <Link to="/create-app">
                <Button size="large" color={'grey'}>
                  Create new app
                </Button>
              </Link>
            </p>
            <h1 className="text-lg font-bold py-5">Databases</h1>
            {data?.databases.map((database) => (
              <p key={database.id}>{database.name}</p>
            ))}
            <p className="py-3">
              <Link to="/create-database">
                <Button size="large" color={'grey'}>
                  Create new database
                </Button>
              </Link>
            </p>
          </div>
          <div className="col-span-5 mt-4">
            <h1 className="text-lg font-bold py-5">Latest activity</h1>
            <p className="text-cool-gray-400">Coming soon</p>
          </div>
        </main>
      </div>
    </div>
  );
};
