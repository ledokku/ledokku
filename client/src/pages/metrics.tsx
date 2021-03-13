import { Container, Heading, Text } from '@chakra-ui/react';
import { HomeHeaderTabNav } from '../modules/home/HomeHeaderTabNav';
import { Header } from '../modules/layout/Header';
import { HeaderContainer } from '../ui';

export const Metrics = () => {
  return (
    <div>
      <HeaderContainer>
        <Header />
        <HomeHeaderTabNav />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Heading as="h2" size="md" py={5}>
          Metrics
        </Heading>
        <Text fontSize="sm" color="gray.400">
          Coming soon
        </Text>
      </Container>
    </div>
  );
};
