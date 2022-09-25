import { Container, Text } from '@nextui-org/react';
import { Header } from '../ui';

export const Settings = () => {
  return (
    <div>
      <Header />

      <Container className='mt-10'>
        <Text h2 className="py-5">
          Configuración
        </Text>
        <Text>
          Proximamente
        </Text>
      </Container>
    </div>
  );
};
