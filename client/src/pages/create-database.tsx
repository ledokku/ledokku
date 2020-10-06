import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ArrowRight } from 'react-feather';
import { toast } from 'react-toastify';
import cx from 'classnames';
import {
  useCreateDatabaseMutation,
  DatabaseTypes,
  useIsPluginInstalledLazyQuery,
  useCreateDatabaseLogsSubscription,
  RealTimeLog,
} from '../generated/graphql';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';
import { Header } from '../modules/layout/Header';

import { dbTypeToDokkuPlugin } from './utils';
import {
  Button,
  Terminal,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  FormLabel,
  FormInput,
  FormHelper,
  Modal,
  ModalDescription,
  ModalTitle,
  ModalButton,
} from '../ui';

const createDatabaseSchema = yup.object().shape({
  name: yup
    .string()
    .required()
    .matches(/^[a-z0-9-]+$/),
});

interface DatabaseBoxProps {
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  onClick?(): void;
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
  const history = useHistory();
  const [isCreateDbModalOpen, setIsCreateDbModalOpen] = useState(false);
  const [arrayOfCreateDbLogs, setArrayofCreateDbLogs] = useState<RealTimeLog[]>(
    []
  );
  const [isCreateDbLoading, setCreateDbLoading] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [createDatabaseMutation] = useCreateDatabaseMutation();
  const [isDbCreationSuccess, setIsDbCreationSuccess] = useState(false);

  useCreateDatabaseLogsSubscription({
    onSubscriptionData: (data) => {
      const logsExist = data.subscriptionData.data?.createDatabaseLogs;

      if (logsExist) {
        setArrayofCreateDbLogs((currentLogs) => {
          return [...currentLogs, logsExist];
        });
        if (
          logsExist.type === 'end' &&
          logsExist.message === 'Successfully created DB'
        ) {
          setIsDbCreationSuccess(true);
        }
      }
    },
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
      name: '',
      type: 'POSTGRESQL',
    },
    validationSchema: createDatabaseSchema,
    onSubmit: async (values) => {
      // TODO validate name
      try {
        await createDatabaseMutation({
          variables: {
            input: { name: values.name, type: values.type },
          },
        });
        // TODO redirect to dashboard if no errors in logs
        setIsTerminalVisible(true);
        setCreateDbLoading(true);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const isPluginInstalled = data?.isPluginInstalled.isPluginInstalled;

  const handleOnClose = (result: boolean) => {
    setIsCreateDbModalOpen(false);
    setCreateDbLoading(false);
    setIsTerminalVisible(false);
    if (result === true) {
      toast.success('Database created successfully');
      history.push('dashboard');
    } else {
      toast.error('Failed to create a database');
    }
  };

  useEffect(() => {
    isDokkuPluginInstalled({
      variables: {
        pluginName: dbTypeToDokkuPlugin(formik.values.type),
      },
    });
  }, [formik.values.type, isPluginInstalled, isDokkuPluginInstalled]);

  return (
    <React.Fragment>
      <Header />

      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold">Create a new database</h1>

        <form onSubmit={formik.handleSubmit} className="mt-8">
          <div className="mt-12">
            {loading && (
              <div className="flex justify-center ">
                <Spinner size="small" />
              </div>
            )}
            {isDokkuPluginInstalledError ? (
              <Alert status="error">
                <AlertTitle>Request failed</AlertTitle>
                <AlertDescription>
                  {isDokkuPluginInstalledError.message}
                </AlertDescription>
              </Alert>
            ) : null}
            {data?.isPluginInstalled.isPluginInstalled === false && !loading && (
              <React.Fragment>
                <p className="mt-3">
                  {`Before creating a `}
                  <span className="font-bold">
                    {formik.values.type.toLowerCase()}
                  </span>
                  {` database, you will need to run this command on your
                    dokku server.`}
                </p>
                <Terminal>{`sudo dokku plugin:install https://github.com/dokku/dokku-${dbTypeToDokkuPlugin(
                  formik.values.type
                )}.git ${dbTypeToDokkuPlugin(formik.values.type)}`}</Terminal>
                <p className="mt-3">
                  Couple of seconds later you will be able to proceed further.
                </p>
              </React.Fragment>
            )}
            {data?.isPluginInstalled.isPluginInstalled === true && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div>
                  <FormLabel>Database name:</FormLabel>
                  <FormInput
                    autoComplete="off"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.name && formik.touched.name)}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <FormHelper status="error">{formik.errors.name}</FormHelper>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12">
            <label className="block mb-2">Choose your database</label>
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
              onClick={() => setIsCreateDbModalOpen(true)}
              color="grey"
              disabled={data?.isPluginInstalled.isPluginInstalled === false}
              iconEnd={<ArrowRight />}
            >
              Create
            </Button>
            {isCreateDbModalOpen && (
              <Modal>
                <ModalTitle>Create database</ModalTitle>
                <ModalDescription>
                  {isTerminalVisible ? (
                    <React.Fragment>
                      <p className="mb-2 ">
                        Creating <b>{formik.values.type}</b> database{' '}
                        <b>{formik.values.name}</b>
                      </p>
                      <Terminal className={'w-6/6'}>
                        <p className="text-green-400 mb-2">
                          Creating database usually takes a couple of minutes.
                          Breathe in, breathe out, logs are about to appear
                          below:
                        </p>
                        {arrayOfCreateDbLogs.map((log) => (
                          <p
                            key={arrayOfCreateDbLogs.indexOf(log)}
                            className={
                              log.message === 'Successfully created DB'
                                ? 'text-s text-green-400 leading-5'
                                : log.message === 'Failed to create DB'
                                ? 'text-s text-red-400 leading-5'
                                : 'text-s leading-5'
                            }
                          >
                            {log.message}
                          </p>
                        ))}
                      </Terminal>
                    </React.Fragment>
                  ) : (
                    <p>
                      You are about to create {formik.values.type} database{' '}
                      <b>{formik.values.name}</b>?
                    </p>
                  )}
                </ModalDescription>
                <ModalButton
                  ctaFn={() => formik.handleSubmit()}
                  ctaText={'Create'}
                  otherButtonText={'Cancel'}
                  isCtaLoading={isTerminalVisible ? false : isCreateDbLoading}
                  isCtaDisabled={isTerminalVisible}
                  closeModal={() => handleOnClose(isDbCreationSuccess)}
                />
              </Modal>
            )}
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
