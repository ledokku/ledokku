import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { ArrowRight } from 'react-feather';
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
import { Button, Terminal, Spinner } from '../ui';

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
    { data, loading },
  ] = useIsPluginInstalledLazyQuery({
    // we poll every 5 sec
    pollInterval: 5000,
  });
  const formik = useFormik<{ name: string; type: DatabaseTypes }>({
    initialValues: {
      name: '',
      type: 'POSTGRESQL',
    },
    onSubmit: async (values) => {
      // TODO validate name
      try {
        const data = await createDatabaseMutation({
          variables: {
            input: { name: values.name, type: values.type },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        // TODO redirect to database page once ready
        history.push('/dashboard');
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
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
              <React.Fragment>
                <label className="block mb-2">Database name:</label>
                <input
                  autoComplete="off"
                  className="block w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </React.Fragment>
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
            <div className="mt-2 text-gray-400">
              {formik.values.type === 'POSTGRESQL' && (
                <p>We currently only provide PostgreSQL</p>
              )}
              {formik.values.type === 'MYSQL' && (
                <p>
                  We currently don't support MySQL.
                  <br />
                  Take a look at{' '}
                  <a
                    href="https://github.com/ledokku/ledokku/issues/22"
                    className="underline"
                  >
                    the issue
                  </a>{' '}
                  to track the progress.
                </p>
              )}
              {formik.values.type === 'MONGODB' && (
                <p>
                  We currently don't support Mongo.
                  <br />
                  Take a look at{' '}
                  <a
                    href="https://github.com/ledokku/ledokku/issues/21"
                    className="underline"
                  >
                    the issue
                  </a>{' '}
                  to track the progress.
                </p>
              )}
              {formik.values.type === 'REDIS' && (
                <p>
                  We currently don't support Redis.
                  <br />
                  Take a look at{' '}
                  <a
                    href="https://github.com/ledokku/ledokku/issues/20"
                    className="underline"
                  >
                    the issue
                  </a>{' '}
                  to track the progress.
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <Button
              type="submit"
              color="grey"
              width="normal"
              disabled={
                data?.isPluginInstalled.isPluginInstalled === false ||
                loading ||
                createDbLoading
              }
              iconEnd={<ArrowRight />}
            >
              {createDbLoading ? <Spinner size="extraSmall" /> : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
