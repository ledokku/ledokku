import React from 'react';
import * as yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Header } from '../../modules/layout/Header';
import {
  useDatabaseByIdQuery,
  useDestroyDatabaseMutation,
  DashboardDocument,
  useDatabaseInfoQuery,
} from '../../generated/graphql';
import { TabNav, TabNavLink, Button, Spinner, Terminal } from '../../ui';

interface InfoProps {
  infoLine: string;
}

export const LineOfInfo = (props: InfoProps) => (
  <React.Fragment>
    <br />
    <p className="text-green-400 w-5/6">{props.infoLine}</p>
  </React.Fragment>
);

export const Settings = () => {
  const { id: databaseId } = useParams();
  let history = useHistory();
  const [
    destroyDatabaseMutation,
    { loading: destroyDbLoading },
  ] = useDestroyDatabaseMutation();
  const { data, loading /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
  });

  const {
    data: databaseInfoData,
    loading: databaseInfoLoading,
  } = useDatabaseInfoQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
    pollInterval: 15000,
  });

  const DeleteDatabaseNameSchema = yup.object().shape({
    databaseName: yup
      .string()
      .required('Required')
      .test(
        'Equals database name',
        'Must match database name',
        (val) => val === data.database.name
      ),
  });

  const formik = useFormik<{ databaseName: string }>({
    initialValues: {
      databaseName: '',
    },

    validateOnChange: true,
    validationSchema: DeleteDatabaseNameSchema,

    onSubmit: async (values) => {
      try {
        await destroyDatabaseMutation({
          variables: {
            input: { databaseId },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        history.push('/dashboard');
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { database } = data;

  if (!database) {
    // TODO nice 404
    return <p>Database not found.</p>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink to={`/database/${database.id}`}>Database</TabNavLink>
          <TabNavLink to={`/database/${database.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/database/${database.id}/settings`} selected>
            Settings
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <div className="col-span-2 w-5/5">
            <h1 className="text-lg font-bold py-5">Info</h1>
            <Terminal className="pt-8 pb-16">
              <p className=" typing items-center ">{` ${database.name} database info:`}</p>
              {!databaseInfoData && !databaseInfoLoading ? (
                <span className="text-yellow-400">Database info loading</span>
              ) : databaseInfoLoading ? (
                'Loading...'
              ) : (
                databaseInfoData.databaseInfo.info.map((infoLine) => (
                  <LineOfInfo infoLine={infoLine} />
                ))
              )}
            </Terminal>
          </div>
          <div className="w-3/3 mb-6">
            <h1 className="text-lg font-bold py-5">Database settings</h1>

            <h2 className="text-gray-400 w-6/6">
              This action cannot be undone. This will permanently delete{' '}
              {database.name} app and everything related to it. Please type{' '}
              <b>{database.name}</b> to confirm deletion.
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-4">
                <input
                  autoComplete="off"
                  className="mb-2 block w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
                  id="databaseName"
                  name="databaseName"
                  value={formik.values.databaseName}
                  onChange={formik.handleChange}
                />
                {!!formik.errors && (
                  <p className="text-red-500 text-sm font-semibold">
                    {formik.errors.databaseName}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={
                    !formik.values.databaseName || !!formik.errors.databaseName
                  }
                  color="red"
                >
                  {destroyDbLoading ? <Spinner size="extraSmall" /> : 'Delete'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
