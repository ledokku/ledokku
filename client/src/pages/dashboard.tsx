import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { useDashboardQuery } from '../generated/graphql';
import { Header } from '../ui';
import { dbTypeToIcon } from './utils';
import { GithubIcon } from '../ui/icons/GithubIcon';
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react';

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

      <Container>
        <div className='w-100 flex flex-row justify-end my-6'>
          <Link to="/create-database">
            <Button bordered className='mr-4'>
              Crear base de datos
            </Button>
          </Link>
          <Link to="/create-app">
            <Button>
              Crear aplicación
            </Button>
          </Link>
        </div>

        <Grid.Container
          as="main"
          gap={6}
        >
          <Grid xs={12} md={7} className="flex flex-col">
            <Text h2>
              Aplicaciones
            </Text>
            {data?.apps.length === 0 ? (
              <Text h6 >
                Sin aplicaciones
              </Text>
            ) : null}
            <Grid.Container gap={1}>
              {data?.apps.map((app) => (
                <Grid xs={12} sm={6}>
                  <Link to={`/app/${app.id}`} className='w-full'>
                    <Card isHoverable isPressable className='w-full'>
                      <Card.Header>
                        <div style={{ width: "auto", height: "auto", padding: "0.3rem" }} className="border-2 rounded-lg">
                          {app.appMetaGithub ? (
                            <div style={{ width: 40, height: 40 }}>
                              <GithubIcon size={40} />
                            </div>
                          ) : (
                            <Image
                              width={40}
                              height={40}
                              objectFit="cover"
                              src="/dokku.png"
                              alt="dokkuLogo"
                            />
                          )}
                        </div>
                        <Grid.Container css={{ pl: "$6" }}>
                          <Grid xs={12}>
                            <Text h4 css={{ lineHeight: "$xs" }}>
                              {app.name}
                            </Text>
                          </Grid>
                          <Grid xs={12}>
                            <Text css={{ color: "$accents8" }} small>{app.id}</Text>
                          </Grid>
                        </Grid.Container>
                      </Card.Header>
                      <Card.Body css={{ py: "$2" }}>
                        <Text>
                          {app.appMetaGithub
                            ? `${app.appMetaGithub.repoOwner}/${app.appMetaGithub.repoName}`
                            : ''}
                        </Text>
                      </Card.Body>
                      <Card.Footer>
                        <Text h6 className='mb-1'>Creado el {format(new Date(app.createdAt), 'MM/DD/YYYY')}</Text>
                      </Card.Footer>
                    </Card></Link>
                </Grid>
              ))}
            </Grid.Container>

            <Text h2 className='mt-8'>
              Bases de datos
            </Text>
            {data?.databases.length === 0 ? (
              <Text h6>
                Sin bases de datos
              </Text>
            ) : (
              <Grid.Container gap={1}>
                {data?.databases.map((database) => {
                  const DbIcon = dbTypeToIcon(database.type)
                  return (
                    <Grid xs={12} sm={6}>
                      <Link to={`/database/${database.id}`} className='w-full'>
                        <Card isHoverable isPressable className='w-full'>
                          <Card.Header>
                            <div style={{ width: "auto", height: "auto", padding: "0.3rem" }} className="border-2 rounded-lg">
                              <div style={{ width: 40, height: 40 }}>
                                <DbIcon size={40} />
                              </div>
                            </div>
                            <Grid.Container css={{ pl: "$6" }}>
                              <Grid xs={12}>
                                <Text h4 css={{ lineHeight: "$xs" }}>
                                  {database.name}
                                </Text>
                              </Grid>
                              <Grid xs={12}>
                                <Text css={{ color: "$accents8" }} small>{database.id}</Text>
                              </Grid>
                            </Grid.Container>
                          </Card.Header>
                          <Card.Footer>
                            <Text h6 className='mb-1'>Creado el {format(new Date(database.createdAt), 'MM/DD/YYYY')}</Text>
                          </Card.Footer>
                        </Card></Link>
                    </Grid>
                  )
                })}
              </Grid.Container>
            )}
          </Grid>

          <Grid xs={12} md={5} className="flex flex-col">
            <Text h2>
              Última actividad
            </Text>
            <Text h6>
              Proximamente
            </Text>
          </Grid>
        </Grid.Container>
      </Container>
    </div>
  );
};
