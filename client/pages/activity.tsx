import { Text } from '@nextui-org/react';
import { AdminLayout } from '../ui/layout/layout';
import { ActivityFeed } from '../ui/modules/activity/ActivityFeed';

const Activity = () => {
  return (
    <AdminLayout>
      <Text h2 className='mb-8'>
        Actividad
      </Text>
      <ActivityFeed />
    </AdminLayout>
  );
};

export default Activity;