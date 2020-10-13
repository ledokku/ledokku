import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  useCreateAppMutation,
  DashboardDocument,
  useAppsQuery,
} from '../generated/graphql';
import { Header } from '../modules/layout/Header';
import { Button, FormHelper, FormInput, FormLabel } from '../ui';
import { toast } from 'react-toastify';

export const CreateApp = () => {
  const history = useHistory();
  const { data } = useAppsQuery();
  const [createAppMutation, { loading }] = useCreateAppMutation();

  const createAppSchema = yup.object().shape({
    name: yup
      .string()
      .required('App name is required')
      .matches(/^[a-z0-9-]+$/)
      .test(
        'Name exists',
        'App with this name already exists',
        (val) => !data?.apps.find((app) => app.name === val)
      ),
  });
  const formik = useFormik<{ name: string }>({
    initialValues: {
      name: '',
    },

    validateOnChange: true,
    validationSchema: createAppSchema,
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
        if (data?.data) {
          toast.success('App created successfully');
          history.push(`/app/${data.data.createApp.app.id}`);
        }
      } catch (error) {
        toast.error(error.message);
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
            Enter app name, click create and voila!
          </h2>
        </div>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <FormLabel>App name: </FormLabel>
              <FormInput
                autoComplete="off"
                // className="inline w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
                id="name"
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.name && formik.touched.name)}
              />
              {formik.errors.name ? (
                <FormHelper status="error">{formik.errors.name}</FormHelper>
              ) : null}

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => formik.handleSubmit()}
                  color="grey"
                  type="submit"
                  disabled={!formik.values.name || !!formik.errors.name}
                  isLoading={loading}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};
