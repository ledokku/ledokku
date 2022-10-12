import { Container, Text } from '@nextui-org/react';
import { ActivityFeed } from '../modules/activity/ActivityFeed';
import { Header } from '../ui';

export const Activity = () => {
  return (
    <div>
      <Header />

      <Container className='mt-10'>
        <Text h2 className='py-5'>
          Actividad
        </Text>
        <ActivityFeed />
      </Container>
    </div>
  );
};
