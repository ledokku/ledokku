import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Container,
} from '@chakra-ui/react';
import { useDashboardQuery } from '../generated/graphql';
import { Header } from '../modules/layout/Header';
import { TabNav, TabNavLink } from '../ui';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';

export const Dashboard = () => {
  // const history = useHistory();
  const { data /* loading, error */ } = useDashboardQuery({
    fetchPolicy: 'cache-and-network',
  });

  // TODO show loading
  // TODO handle error

  // TODO if no apps or dbs show onboarding screen

  return (
    <div>
      <Header />

      <Container maxW="5xl">
        {/* TODO migrate TabNav to chakra-ui */}
        <TabNav>
          <TabNavLink to="/dashboard" selected>
            Dashboard
          </TabNavLink>
          <TabNavLink to="/activity">Activity</TabNavLink>
          <TabNavLink to="/metrics">Metrics</TabNavLink>
          <TabNavLink to="/settings">Settings</TabNavLink>
        </TabNav>
      </Container>

      <Container maxW="5xl" py={6}>
        <Box display="flex" justifyContent="flex-end" pb={6}>
          <Link to="/create-database">
            <Button colorScheme="gray" variant="outline" fontSize="sm" mr={3}>
              Create database
            </Button>
          </Link>
          <Link to="/create-app">
            <Button colorScheme="gray" fontSize="sm">
              Create app
            </Button>
          </Link>
        </Box>

        <Grid
          as="main"
          templateColumns="repeat(12, 1fr)"
          gap={{ base: 6, md: 20 }}
          pt={4}
        >
          <GridItem colSpan={{ base: 12, md: 7 }}>
            <Heading as="h2" size="md" py={5}>
              Apps
            </Heading>
            {data?.apps.length === 0 ? (
              <Text fontSize="sm" color="gray.400">
                No apps deployed.
              </Text>
            ) : null}
            {data?.apps.map((app) => (
              <Box
                key={app.id}
                py={3}
                borderBottom={'1px'}
                borderColor="gray.200"
              >
                <Box mb={1} color="gray.900" fontWeight="medium">
                  <Link to={`/app/${app.id}`}>{app.name}</Link>
                </Box>
                <Box
                  fontSize="sm"
                  color="gray.400"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Text>ledokku/ledokku</Text>
                  <Text>
                    Created on {format(new Date(app.createdAt), 'MM/DD/YYYY')}
                  </Text>
                </Box>
              </Box>
            ))}

            <Heading as="h2" size="md" py={5} mt={8}>
              Databases
            </Heading>
            {data?.databases.length === 0 ? (
              <Text fontSize="sm" color="gray.400">
                No databases created.
              </Text>
            ) : null}
            {data?.databases.map((database) => (
              <Box
                key={database.id}
                py={3}
                borderBottom={'1px'}
                borderColor="gray.200"
              >
                <Box mb={1} color="gray.900" fontWeight="medium">
                  <Link to={`/database/${database.id}`}>{database.name}</Link>
                </Box>
                <Box
                  fontSize="sm"
                  color="gray.400"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Text display="flex" alignItems="center">
                    {database.type === 'POSTGRESQL' ? (
                      <>
                        <Box mr={1} as="span">
                          <PostgreSQLIcon size={16} />
                        </Box>
                        PostgreSQL
                      </>
                    ) : undefined}
                    {database.type === 'MONGODB' ? (
                      <>
                        <Box mr={1} as="span">
                          <MongoIcon size={16} />
                        </Box>
                        Mongo
                      </>
                    ) : undefined}
                    {database.type === 'REDIS' ? (
                      <>
                        <Box mr={1} as="span">
                          <RedisIcon size={16} />
                        </Box>
                        Redis
                      </>
                    ) : undefined}
                    {database.type === 'MYSQL' ? (
                      <>
                        <Box mr={1} as="span">
                          <MySQLIcon size={16} />
                        </Box>
                        MySQL
                      </>
                    ) : undefined}
                  </Text>
                  <Text>
                    Created on{' '}
                    {format(new Date(database.createdAt), 'MM/DD/YYYY')}
                  </Text>
                </Box>
              </Box>
            ))}
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 5 }}>
            <Heading as="h2" size="md" py={5}>
              Latest activity
            </Heading>
            <Text fontSize="sm" color="gray.400">
              Coming soon
            </Text>
          </GridItem>
        </Grid>
      </Container>
    </div>
  );
};
