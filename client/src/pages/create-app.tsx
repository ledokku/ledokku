import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { useCreateAppMutation, DashboardDocument } from '../generated/graphql';
import { Header } from '../modules/layout/Header';
import { Button } from '../ui';

export const CreateApp = () => {
  const history = useHistory();
  const [createAppMutation, { loading }] = useCreateAppMutation();
  const formik = useFormik<{ name: string }>({
    initialValues: {
      name: '',
    },
    // TODO yup validation
    onSubmit: async (values) => {
      // TODO validate name
      try {
        const data = await createAppMutation({
          variables: {
            name: values.name,
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        history.push(`/app/${data.data.createApp.app.id}`);
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  return (
    <React.Fragment>
      <Header />

      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold">Create a new app</h1>
        <div className="mt-4 mb-4">
          <h2 className="text-gray-400">
            Enter app name and link to your github repository. Click create and
            voila!
          </h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-2">
          <div className="mt-8">
            <input
              autoComplete="off"
              className="inline w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
              id="name"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </div>
          <div className="mt-4">
            <Button
              color="grey"
              type="submit"
              disabled={!formik.values.name}
              isLoading={loading}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
