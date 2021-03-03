import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertTitle,
  AlertDescription,
  Text,
  FormLabel,
  Button,
  Box,
  Grid,
} from '@chakra-ui/react';
import { ArrowRight, ArrowLeft } from 'react-feather';
import { toast } from 'react-toastify';
import {
  useCreateDatabaseMutation,
  DatabaseTypes,
  useIsPluginInstalledLazyQuery,
  useCreateDatabaseLogsSubscription,
  RealTimeLog,
  useDatabaseQuery,
} from '../generated/graphql';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';
import { Header } from '../modules/layout/Header';
import { dbTypeToDokkuPlugin } from './utils';
import { Terminal } from '../ui';

interface DatabaseBoxProps {
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  onClick?(): void;
}

enum DbCreationStatus {
  FAILURE = 'Failure',
  SUCCESS = 'Success',
}

const DatabaseBox = ({ label, selected, icon, onClick }: DatabaseBoxProps) => {
  return (
    <Box
      p="12"
      display="flex"
      flexDirection="column"
      alignItems="center"
      border="1px"
      borderColor={selected ? 'black' : 'gray.300'}
      opacity={selected ? '100%' : '50%'}
      cursor="pointer"
      borderRadius="base"
      onClick={onClick}
    >
      <Box mb="2">{icon}</Box>
      <p>{label}</p>
    </Box>
  );
};

export const CreateDatabase = () => {
  const location = useLocation();
  const history = useHistory();

  const { data: dataDb } = useDatabaseQuery();
  const [arrayOfCreateDbLogs, setArrayofCreateDbLogs] = useState<RealTimeLog[]>(
    []
  );
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [createDatabaseMutation] = useCreateDatabaseMutation();
  const [
    isDbCreationSuccess,
    setIsDbCreationSuccess,
  ] = useState<DbCreationStatus>();

  useCreateDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.createDatabaseLogs;

      if (logsExist) {
        setArrayofCreateDbLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (logsExist.type === 'end:success') {
          setIsDbCreationSuccess(DbCreationStatus.SUCCESS);
        } else if (logsExist.type === 'end:failure') {
          setIsDbCreationSuccess(DbCreationStatus.FAILURE);
        }
      }
    },
  });

  const createDatabaseSchema = yup.object({
    type: yup
      .string()
      .oneOf(['POSTGRESQL', 'MYSQL', 'MONGODB', 'REDIS'])
      .required(),
    name: yup.string().when('type', (type: DatabaseTypes) => {
      return yup
        .string()
        .required('Database name is required')
        .matches(/^[a-z0-9-]+$/)
        .test(
          'Name already exists',
          `You already have created ${type} database with this name`,
          (name) =>
            !dataDb?.databases.find(
              (db) => db.name === name && type === db.type
            )
        );
    }),
  });

  const [
    isDokkuPluginInstalled,
    { data, loading, error: isDokkuPluginInstalledError },
  ] = useIsPluginInstalledLazyQuery({
    // we poll every 5 sec
    pollInterval: 5000,
  });
  const formik = useFormik<{ name: string; type: DatabaseTypes }>({
    initialValues: {
      name: location.state ? (location.state as string) : '',
      type: 'POSTGRESQL',
    },
    validateOnChange: true,
    validationSchema: createDatabaseSchema,
    onSubmit: async (values) => {
      try {
        await createDatabaseMutation({
          variables: {
            input: { name: values.name, type: values.type },
          },
        });
        setIsTerminalVisible(true);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const isPluginInstalled = data?.isPluginInstalled.isPluginInstalled;

  const handleNext = () => {
    setIsTerminalVisible(false);
    const dbId = arrayOfCreateDbLogs[arrayOfCreateDbLogs.length - 1].message;
    history.push(`database/${dbId}`);
  };

  // Effect for checking whether plugin is installed
  useEffect(() => {
    isDokkuPluginInstalled({
      variables: {
        pluginName: dbTypeToDokkuPlugin(formik.values.type),
      },
    });
  }, [formik.values.type, isPluginInstalled, isDokkuPluginInstalled]);

  // Effect for db creation
  useEffect(() => {
    isDbCreationSuccess === DbCreationStatus.FAILURE
      ? toast.error('Failed to create database')
      : isDbCreationSuccess === DbCreationStatus.SUCCESS &&
        toast.success('Database created successfully');
  }, [isDbCreationSuccess]);

  return (
    <>
      <Header />

      <Container maxW="5xl" my="4">
        <Heading as="h2" size="md">
          Create a new database
        </Heading>
        <Box mt="12">
          {isTerminalVisible ? (
            <>
              <Text mb="2">
                Creating <b>{formik.values.type}</b> database{' '}
                <b>{formik.values.name}</b>
              </Text>
              <Text mb="2" color="gray.500">
                Creating database usually takes a couple of minutes. Breathe in,
                breathe out, logs are about to appear below:
              </Text>
              <Terminal>
                {arrayOfCreateDbLogs.map((log) => (
                  <Text key={arrayOfCreateDbLogs.indexOf(log)} size="small">
                    {log.message}
                  </Text>
                ))}
              </Terminal>

              {!!isDbCreationSuccess &&
              isDbCreationSuccess === DbCreationStatus.SUCCESS ? (
                <Box mt="12" display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => handleNext()}
                    rightIcon={<ArrowRight />}
                  >
                    Next
                  </Button>
                </Box>
              ) : !!isDbCreationSuccess &&
                isDbCreationSuccess === DbCreationStatus.FAILURE ? (
                <Box mt="12" display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => {
                      setIsTerminalVisible(false);
                      formik.resetForm();
                    }}
                    rightIcon={<ArrowLeft />}
                  >
                    Back
                  </Button>
                </Box>
              ) : null}
            </>
          ) : (
            <Box mt="8">
              <form onSubmit={formik.handleSubmit}>
                <Box mt="12">
                  {loading && (
                    <Center>
                      <Spinner />
                    </Center>
                  )}
                  {isDokkuPluginInstalledError ? (
                    <Alert
                      status="error"
                      variant="top-accent"
                      flexDirection="column"
                      alignItems="flex-start"
                      borderBottomRadius="base"
                      boxShadow="md"
                    >
                      <AlertTitle mr={2}>Request failed</AlertTitle>
                      <AlertDescription>
                        {isDokkuPluginInstalledError.message}
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  {data?.isPluginInstalled.isPluginInstalled === false &&
                    !loading && (
                      <>
                        <Text mt="3">
                          Before creating a{' '}
                          <b>{formik.values.type.toLowerCase()}</b> database,
                          you will need to run this command on your dokku
                          server.
                        </Text>
                        <Terminal>{`sudo dokku plugin:install https://github.com/dokku/dokku-${dbTypeToDokkuPlugin(
                          formik.values.type
                        )}.git ${dbTypeToDokkuPlugin(
                          formik.values.type
                        )}`}</Terminal>
                        <Text mt="3">
                          Couple of seconds later you will be able to proceed
                          further.
                        </Text>
                      </>
                    )}
                  {data?.isPluginInstalled.isPluginInstalled === true &&
                    !loading && (
                      <SimpleGrid columns={{ sm: 1, md: 3 }}>
                        <FormControl
                          id="name"
                          isInvalid={Boolean(
                            formik.errors.name && formik.touched.name
                          )}
                        >
                          <FormLabel>Database name</FormLabel>
                          <Input
                            autoComplete="off"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <FormErrorMessage>
                            {formik.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>
                    )}
                </Box>

                <Box mt="12">
                  <Text mb="2">Choose your database</Text>
                  <Grid
                    templateColumns={{
                      base: 'repeat(2, minmax(0, 1fr))',
                      md: 'repeat(4, minmax(0, 1fr))',
                    }}
                    gap="4"
                  >
                    <DatabaseBox
                      selected={formik.values.type === 'POSTGRESQL'}
                      label="PostgreSQL"
                      icon={<PostgreSQLIcon size={40} />}
                      onClick={() => formik.setFieldValue('type', 'POSTGRESQL')}
                    />
                    <DatabaseBox
                      selected={formik.values.type === 'MYSQL'}
                      label="MySQL"
                      icon={<MySQLIcon size={40} />}
                      onClick={() => formik.setFieldValue('type', 'MYSQL')}
                    />
                    <DatabaseBox
                      selected={formik.values.type === 'MONGODB'}
                      label="Mongo"
                      icon={<MongoIcon size={40} />}
                      onClick={() => formik.setFieldValue('type', 'MONGODB')}
                    />
                    <DatabaseBox
                      selected={formik.values.type === 'REDIS'}
                      label="Redis"
                      icon={<RedisIcon size={40} />}
                      onClick={() => formik.setFieldValue('type', 'REDIS')}
                    />
                  </Grid>
                </Box>

                <Box mt="12" display="flex" justifyContent="flex-end">
                  <Button
                    isLoading={formik.isSubmitting}
                    disabled={
                      data?.isPluginInstalled.isPluginInstalled === false ||
                      !formik.values.name ||
                      !!formik.errors.name ||
                      !dataDb?.databases
                    }
                    rightIcon={<ArrowRight />}
                    type="submit"
                  >
                    Create
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};
