import { Text } from '@nextui-org/react';
import { ActivityFeed } from '../modules/activity/ActivityFeed';

export const Activity = () => {
  return (
    <>
      <Text h2 className='mb-8'>
        Actividad
      </Text>
      <ActivityFeed />
    </>
  );
};
