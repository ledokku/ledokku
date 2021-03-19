import { useHistory } from 'react-router-dom';
import React from 'react';
import { useFormik } from 'formik';
import { trackGoal } from 'fathom-client';
import * as yup from 'yup';
import {
  useCreateAppDokkuMutation,
  useAppsQuery,
} from '../../generated/graphql';
import { Header } from '../../modules/layout/Header';
import {
  Button,
  FormHelper,
  FormInput,
  FormLabel,
  HeaderContainer,
} from '../../ui';
import { useToast } from '../../ui/toast';
import { trackingGoals } from '../../config';

export const CreateAppDokku = () => {
  const history = useHistory();
  const toast = useToast();
  const { data: dataApps } = useAppsQuery();
  const [createAppDokkuMutation, { loading }] = useCreateAppDokkuMutation();

  const createAppSchema = yup.object().shape({
    name: yup
      .string()
      .required('App name is required')
      .matches(/^[a-z0-9-]+$/)
      .test(
        'Name exists',
        'App with this name already exists',
        (val) => !dataApps?.apps.find((app) => app.name === val)
      ),
  });

  const formik = useFormik<{
    name: string;
  }>({
    initialValues: {
      name: '',
    },

    validateOnChange: true,
    validationSchema: createAppSchema,
    onSubmit: async (values) => {
      try {
        const res = await createAppDokkuMutation({
          variables: {
            input: {
              name: values.name,
            },
          },
        });

        trackGoal(trackingGoals.createAppDokku, 0);

        if (res.data) {
          history.push(`app/${res.data?.createAppDokku.appId}`);
          toast.success('App created successfully');
        }
      } catch (error) {
        toast.error(error);
      }
    },
  });

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>

      <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-4">
        <h1 className="text-lg font-bold">Create a new app</h1>
        <div className="mt-12">
          <React.Fragment>
            <React.Fragment>
              <>
                <div className="mt-4 mb-4">
                  <h2 className="text-gray-400">
                    Enter app name, click create and voila!
                  </h2>
                </div>
              </>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-10">
                  <div>
                    <FormLabel>App name: </FormLabel>
                    <FormInput
                      autoComplete="off"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.name && formik.touched.name)}
                    />
                    {formik.errors.name ? (
                      <FormHelper status="error">
                        {formik.errors.name}
                      </FormHelper>
                    ) : null}
                  </div>
                  <div>
                    <div className="mt-8 flex justify-end">
                      <Button
                        type="submit"
                        color="grey"
                        disabled={
                          loading || !formik.values.name || !!formik.errors.name
                        }
                        isLoading={loading}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </React.Fragment>
          </React.Fragment>
        </div>
      </div>
    </>
  );
};
