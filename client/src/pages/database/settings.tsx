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
import { TabNav, TabNavLink, Button, FormInput, FormHelper } from '../../ui';
import { Container, Heading } from '@chakra-ui/react';
import { useToast } from '../../ui/toast';

export const Settings = () => {
  const { id: databaseId } = useParams<{ id: string }>();
  let history = useHistory();
  const toast = useToast();
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
        (val) => val === data?.database?.name
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
        toast.success('Database deleted successfully');

        history.push('/dashboard');
      } catch (error) {
        toast.error(error.message);
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

  const databaseInfos = databaseInfoData?.databaseInfo.info
    .map((data) => data.trim())
    .map((info) => {
      const name = info.split(':')[0];
      const value = info.substring(info.indexOf(':') + 1).trim();
      return { name, value };
    });

  return (
    <div>
      <Header />
      <Container maxW="5xl">
        <TabNav>
          <TabNavLink to={`/database/${database.id}`}>Database</TabNavLink>
          <TabNavLink to={`/database/${database.id}/logs`}>Logs</TabNavLink>
          <TabNavLink to={`/database/${database.id}/settings`} selected>
            Settings
          </TabNavLink>
        </TabNav>
      </Container>

      <Container maxW="5xl" mt={10}>
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <div className="col-span-2 w-5/5">
            <Heading as="h2" size="md" py={5}>
              Info for {database.name}
            </Heading>
            {databaseInfoLoading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : null}
            {!databaseInfoLoading && databaseInfos
              ? databaseInfos.map((info) => (
                  <div key={info.name} className="py-2">
                    <div className="font-semibold">{info.name}</div>
                    <div>{info.value}</div>
                  </div>
                ))
              : null}
          </div>
          <div className="w-3/3 mb-6">
            <h1 className="text-lg font-bold py-5">Database settings</h1>

            <h2 className="text-gray-400 w-6/6">
              This action cannot be undone. This will permanently delete{' '}
              {database.name} database and everything related to it. Please type{' '}
              <b>{database.name}</b> to confirm deletion.
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid md:grid-cols-3">
                <div className="mt-4">
                  <FormInput
                    autoComplete="off"
                    id="databaseName"
                    name="databaseName"
                    value={formik.values.databaseName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      formik.errors.databaseName && formik.touched.databaseName
                    )}
                  />
                  {formik.errors.databaseName && formik.errors.databaseName ? (
                    <FormHelper status="error">
                      {formik.errors.databaseName}
                    </FormHelper>
                  ) : null}
                  <Button
                    type="submit"
                    isLoading={destroyDbLoading}
                    disabled={
                      !formik.values.databaseName ||
                      !!formik.errors.databaseName
                    }
                    color="red"
                    className="mt-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};
