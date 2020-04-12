import React from 'react';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';

export const Dashboard: React.FC = (props) => {
  return (
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Dashboard',
        },
      ]}
    ></LoggedInLayout>
  );
};

export default Dashboard;
