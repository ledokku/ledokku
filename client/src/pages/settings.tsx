import { Container, Heading, Text } from '@chakra-ui/react';
import { Header } from '../modules/layout/Header';
import { HeaderContainer, TabNav, TabNavLink } from '../ui';

export const Settings = () => {
  return (
    <div>
      <HeaderContainer>
        <Header />

        <Container maxW="5xl">
          <TabNav>
            <TabNavLink to="/dashboard">Dashboard</TabNavLink>
            <TabNavLink to="/activity">Activity</TabNavLink>
            <TabNavLink to="/metrics">Metrics</TabNavLink>
            <TabNavLink to="/settings" selected>
              Settings
            </TabNavLink>
          </TabNav>
        </Container>
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Heading as="h2" size="md" py={5}>
          Settings
        </Heading>
        <Text fontSize="sm" color="gray.400">
          Coming soon
        </Text>
      </Container>
    </div>
  );
};
