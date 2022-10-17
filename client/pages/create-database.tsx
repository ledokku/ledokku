import { Button, Grid, Input, Loading, Text, useTheme } from '@nextui-org/react';
import { trackGoal } from 'fathom-client';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { TerminalOutput } from 'react-terminal-ui';
import * as yup from 'yup';
import { trackingGoals } from '../constants';
import {
  DbTypes, LogPayload, useCreateDatabaseLogsSubscription, useCreateDatabaseMutation, useDatabaseQuery, useIsPluginInstalledLazyQuery
} from '../generated/graphql';
import { Alert } from '../ui/components/Alert';
import { CodeBox } from '../ui/components/CodeBox';
import { LoadingSection } from '../ui/components/LoadingSection';
import { Terminal } from '../ui/components/Terminal';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';
import { AdminLayout } from '../ui/layout/layout';
import { useToast } from '../ui/toast';
import { dbTypeToDokkuPlugin } from '../utils/utils';

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

const DatabaseBox = ({
  label,
  selected,
  icon,
  onClick,
}: DatabaseBoxProps) => {
  const { theme } = useTheme();
  return (
    <div
      className={`w-full p-12 flex flex-col items-center border-2 rounded-lg  ${onClick ? 'grayscale-0 opacity-100 cursor-pointer' : 'grayscale  opacity-50'}`}
      onClick={onClick}
      style={
        {
          borderColor: selected ? theme?.colors.primary.value : theme?.colors.border.value,
          border: "solid"
        }
      }
    >
      <div className='mb-2 h-12'>{icon}</div>
      <Text h3>{label}</Text>
    </div>
  );
};

const CreateDatabase = () => {
  const history = useRouter();
  const toast = useToast();

  const { data: dataDb } = useDatabaseQuery({
    variables: {
      limit: 1_000_000
    }
  });
  const [arrayOfCreateDbLogs, setArrayofCreateDbLogs] = useState<LogPayload[]>(
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
    name: yup.string().when('type', (type: DbTypes) => {
      return yup
        .string()
        .required('Nombre de la base de datos requerido')
        .matches(/^[a-z0-9-]+$/, `Debe cumplir con el patron ${/^[a-z0-9-]+$/}`)
        .test(
          'Ya existe el nombre',
          `Ya creaste una base de datos ${type} con este nombre`,
          (name) =>
            !dataDb?.databases.items.find(
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
  const formik = useFormik<{ name: string; type: DbTypes }>({
    initialValues: {
      name: '',
      type: DbTypes.Postgresql,
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

        trackGoal(trackingGoals.createDatabase, 0);
      } catch (error: any) {
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
      ? toast.error('Error al crear la base de datos')
      : isDbCreationSuccess === DbCreationStatus.SUCCESS &&
      toast.success('Base de datos creada');
  }, [isDbCreationSuccess, toast]);

  console.log(arrayOfCreateDbLogs);


  return (
    <AdminLayout>
      <Text h2>
        Crear una base de datos
      </Text>
      {loading ? <LoadingSection /> :
        <div className='mt-12'>
          {isTerminalVisible ? (
            <div className='mb-12'>
              <Text>
                Creando la base de datos <b>{formik.values.type}</b> <b>{formik.values.name}</b>
              </Text>
              <Text className='mb-8'>
                Crear una base de datos usualmente toma unos cuantos minutos. Respira un poco, los registros apareceran pronto:
              </Text>
              <Terminal>
                {arrayOfCreateDbLogs.map((log, index) => (
                  <TerminalOutput key={index}>
                    {log.message}
                  </TerminalOutput>
                ))}
              </Terminal>

              {!!isDbCreationSuccess &&
                isDbCreationSuccess === DbCreationStatus.SUCCESS ? (
                <div className='mt-12 flex justify-end'>
                  <Button
                    onClick={() => handleNext()}
                    iconRight={<FiArrowRight size={20} />}
                  >
                    Siguiente
                  </Button>
                </div>
              ) : !!isDbCreationSuccess &&
                isDbCreationSuccess === DbCreationStatus.FAILURE ? (
                <div className='mt-12 flex justify-end'>
                  <Button
                    onClick={() => {
                      setIsTerminalVisible(false);
                      formik.resetForm();
                    }}
                    icon={<FiArrowLeft size={20} />}
                  >
                    Atras
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className='mt-8'>
              <form onSubmit={formik.handleSubmit}>
                <div className='mt-12'>
                  {isDokkuPluginInstalledError ? (
                    <Alert
                      type="error"
                      title='Solicitud fallida'
                      message={isDokkuPluginInstalledError.message}
                    />
                  ) : null}
                  {data?.isPluginInstalled.isPluginInstalled === false &&
                    !loading && (
                      <>
                        <Text>
                          Antes de crear una base de datos <b>{formik.values.type.toLowerCase()}</b>,
                          necesitas correr el siguiente comando en tu servidor de Dokku:
                        </Text>
                        <CodeBox lang='bash'>
                          {`sudo dokku plugin:install https://github.com/dokku/dokku-${dbTypeToDokkuPlugin(
                            formik.values.type
                          )}.git ${dbTypeToDokkuPlugin(
                            formik.values.type
                          )}`}
                        </CodeBox>
                        <Text>
                          Unos segundos después puedes continuar
                        </Text>
                      </>
                    )}
                  {data?.isPluginInstalled.isPluginInstalled === true &&
                    !loading && (
                      <Grid.Container gap={2} className="mt-8">
                        <Grid xs={12} css={{ padding: 0 }} direction="column">
                          <Input
                            autoComplete="off"
                            id="name"
                            label='Nombre de la base de datos'
                            name="name"
                            width='300px'
                            placeholder='Nombre'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <Text color='$error'>
                            {formik.errors.name}
                          </Text>
                        </Grid>

                      </Grid.Container>
                    )}
                </div>

                <div className='mt-12'>
                  <Text h3>Elige tu base de datos</Text>
                  <Grid.Container gap={3}>
                    <Grid xs={12} md={3}>
                      <DatabaseBox
                        selected={formik.values.type === 'POSTGRESQL'}
                        label="PostgreSQL"
                        icon={<PostgreSQLIcon size={40} />}
                        onClick={() => formik.setFieldValue('type', 'POSTGRESQL')}
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <DatabaseBox
                        selected={formik.values.type === 'MYSQL'}
                        label="MySQL"
                        icon={<MySQLIcon size={40} />}
                        onClick={() => formik.setFieldValue('type', 'MYSQL')}
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <DatabaseBox
                        selected={formik.values.type === 'MONGODB'}
                        label="MongoDB"
                        icon={<MongoIcon size={40} />}
                        onClick={() => formik.setFieldValue('type', 'MONGODB')}
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <DatabaseBox
                        selected={formik.values.type === 'REDIS'}
                        label="Redis"
                        icon={<RedisIcon size={40} />}
                        onClick={() => formik.setFieldValue('type', 'REDIS')}
                      />
                    </Grid>
                  </Grid.Container>
                </div>

                <div className='mt-12 flex justify-end'>
                  <Button
                    disabled={
                      data?.isPluginInstalled.isPluginInstalled === false ||
                      !formik.values.name ||
                      !!formik.errors.name ||
                      !dataDb?.databases
                    }
                    iconRight={<FiArrowRight size={20} />}
                    type="submit"
                  >
                    {formik.isSubmitting ? <Loading color="currentColor" /> : "Crear"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>}
    </AdminLayout>
  );
};

export default CreateDatabase;