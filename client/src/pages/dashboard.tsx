import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { useDashboardQuery } from '../generated/graphql';
import { Header } from '../modules/layout/Header';
import { TabNav, TabNavLink, Button } from '../ui';
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
        <div className="flex justify-end pb-6">
          <Link to="/create-database">
            <Button color={'grey'} variant="outline" className="text-sm mr-3">
              Create database
            </Button>
          </Link>
          <Link to="/create-app">
            <Button color={'grey'} className="text-sm">
              Create app
            </Button>
          </Link>
        </div>

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
              <div className="text-gray-400 text-sm mt-2">
                No apps deployed.{' '}
              </div>
            ) : null}
            {data?.apps.map((app) => (
              <div key={app.id} className="py-3 border-b border-gray-200">
                <div className="mb-1 text-gray-900 font-medium">
                  <Link to={`/app/${app.id}`}>
                    <div>{app.name}</div>
                  </Link>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <div>ledokku/ledokku</div>
                  <div>
                    Created on {format(new Date(app.createdAt), 'MM/DD/YYYY')}
                  </div>
                </div>
              </div>
            ))}

            <Heading as="h2" size="md" py={5} mt={8}>
              Databases
            </Heading>
            {/* <h1 className="text-lg font-bold pb-2 pt-5">Databases</h1> */}
            {data?.databases.length === 0 ? (
              <div className="text-gray-400 text-sm mt-2">
                No databases created.
              </div>
            ) : null}
            {data?.databases.map((database) => (
              <div key={database.id} className="py-3 border-b border-gray-200">
                <div className="mb-1 text-gray-900 font-medium">
                  <Link to={`/database/${database.id}`}>{database.name}</Link>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <div className="flex items-center">
                    {database.type === 'POSTGRESQL' ? (
                      <>
                        <PostgreSQLIcon size={16} className="mr-1" />
                        PostgreSQL
                      </>
                    ) : undefined}
                    {database.type === 'MONGODB' ? (
                      <>
                        <MongoIcon size={16} className="mr-1" />
                        Mongo
                      </>
                    ) : undefined}
                    {database.type === 'REDIS' ? (
                      <>
                        <RedisIcon size={16} className="mr-1" />
                        Redis
                      </>
                    ) : undefined}
                    {database.type === 'MYSQL' ? (
                      <>
                        <MySQLIcon size={16} className="mr-1" />
                        MySQL
                      </>
                    ) : undefined}
                  </div>
                  <div>
                    Created on{' '}
                    {format(new Date(database.createdAt), 'MM/DD/YYYY')}
                  </div>
                </div>
              </div>
            ))}
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 5 }}>
            <Heading as="h2" size="md" py={5}>
              Latest activity
            </Heading>
            <Text
              fontSize="sm"
              color="gray.400"
              // className="text-gray-400 text-sm"
            >
              Coming soon
            </Text>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};
