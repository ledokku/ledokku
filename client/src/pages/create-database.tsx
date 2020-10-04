import React, { useEffect } from 'react';
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
  DashboardDocument,
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
  const [
    createDatabaseMutation,
    { loading: createDbLoading },
  ] = useCreateDatabaseMutation();
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
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        toast.success('Database created successfully');
        // TODO redirect to database page once ready
        history.push('/dashboard');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const isPluginInstalled = data?.isPluginInstalled.isPluginInstalled;

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
              type="submit"
              color="grey"
              disabled={data?.isPluginInstalled.isPluginInstalled === false}
              isLoading={createDbLoading || loading}
              iconEnd={<ArrowRight />}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
