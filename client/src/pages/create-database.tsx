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
} from '@chakra-ui/react';
import { ArrowRight, ArrowLeft } from 'react-feather';
import { toast } from 'react-toastify';
import cx from 'classnames';
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
    <div
      className={cx(
        'flex flex-col items-center p-12 bg-white border border-grey rounded cursor-pointer opacity-50 transition duration-200',
        {
          'border-black opacity-100': selected,
        }
      )}
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <p>{label}</p>
    </div>
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
    name: yup
      .string()
      .required('Database name is required')
      .matches(/^[a-z0-9-]+$/),
    // .when('type', (type: DatabaseTypes) => {
    //   return yup
    //     .string()
    //     .test(
    //       'Name already exists',
    //       `You already have created ${type} database with this name`,
    //       (name) =>
    //         !dataDb?.databases.find(
    //           (db) => db.name === name && type === db.type
    //         )
    //     );
    // }),
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
        <div className="mt-12">
          {isTerminalVisible ? (
            <>
              <p className="mb-2 ">
                Creating <b>{formik.values.type}</b> database{' '}
                <b>{formik.values.name}</b>
              </p>
              <p className="text-gray-500 mb-2">
                Creating database usually takes a couple of minutes. Breathe in,
                breathe out, logs are about to appear below:
              </p>
              <Terminal className={'w-6/6'}>
                {arrayOfCreateDbLogs.map((log) => (
                  <p
                    key={arrayOfCreateDbLogs.indexOf(log)}
                    className={'text-s leading-5'}
                  >
                    {log.message}
                  </p>
                ))}
              </Terminal>

              {!!isDbCreationSuccess &&
              isDbCreationSuccess === DbCreationStatus.SUCCESS ? (
                <div className="mt-12 flex justify-end">
                  <Button
                    onClick={() => handleNext()}
                    color="grey"
                    iconEnd={<ArrowRight />}
                  >
                    Next
                  </Button>
                </div>
              ) : !!isDbCreationSuccess &&
                isDbCreationSuccess === DbCreationStatus.FAILURE ? (
                <div className="mt-12 flex justify-start">
                  <Button
                    onClick={() => {
                      setIsTerminalVisible(false);
                      formik.resetForm();
                    }}
                    color="grey"
                    iconEnd={<ArrowLeft />}
                  >
                    Back
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <form onSubmit={formik.handleSubmit} className="mt-8">
              <div className="mt-12">
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
                        <Box fontWeight="bold" as="span">
                          {formik.values.type.toLowerCase()}
                        </Box>{' '}
                        database, you will need to run this command on your
                        dokku server.
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
              </div>

              <div className="mt-12">
                <Text mb="2">Choose your database</Text>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </div>
                <div className="mt-2 text-gray-400"></div>
              </div>

              <div className="mt-12 flex justify-end">
                <Button
                  isLoading={formik.isSubmitting}
                  disabled={
                    data?.isPluginInstalled.isPluginInstalled === false ||
                    !formik.values.name ||
                    !!formik.errors.name ||
                    !dataDb?.databases
                  }
                  rightIcon={<ArrowRight />}
                  onClick={() => formik.handleSubmit()}
                >
                  Create
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </>
  );
};
