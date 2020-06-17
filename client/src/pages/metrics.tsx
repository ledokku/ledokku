import React from 'react';
import { Header } from '../modules/layout/Header';
import { TabNav, TabNavLink } from '../ui';

export const Metrics = () => {
  // const { data, loading, error } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to="/dashboard">Dashboard</TabNavLink>
          <TabNavLink to="/activity">Activity</TabNavLink>
          <TabNavLink to="/metrics" selected>
            Metrics
          </TabNavLink>
          <TabNavLink to="/settings">Settings</TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-10">
          <h1 className="text-lg font-bold py-5">Metrics</h1>
        </div>
      </div>
    </div>
  );
};
