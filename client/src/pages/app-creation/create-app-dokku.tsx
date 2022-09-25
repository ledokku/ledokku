import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { trackGoal } from 'fathom-client';
import * as yup from 'yup';
import {
  FormControl,
} from '@chakra-ui/react';
import {
  useCreateAppDokkuMutation,
  useAppsQuery,
} from '../../generated/graphql';
import { Header } from '../../ui';
import { useToast } from '../../ui/toast';
import { trackingGoals } from '../../config';
import { Button, Container, Grid, Input, Loading, Text } from '@nextui-org/react';

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
      } catch (error: any) {
        toast.error(error);
      }
    },
  });

  return (
    <>
      <Header />

      <Container className='mt-10'>
        <Text h2>
          Crear aplicación nueva
        </Text>

        <Text className='mt-12 mb-8' >
          Escribe el nombre de la apicación y estará listo!
        </Text>

        <Grid.Container>
          <Grid>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                id="v"
                isInvalid={Boolean(formik.errors.name && formik.touched.name)}
              >
                <Input
                  label='Nombre de la aplicación'
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Text color='error'>{formik.errors.name}</Text>
              </FormControl>

              <div className='mt-4 flex justify-end'>
                <Button
                  className='mt-8'
                  type="submit"
                  disabled={
                    loading || !formik.values.name || !!formik.errors.name
                  }
                >
                  {
                    !loading ? "Crear" : <Loading color="currentColor" />
                  }
                </Button>
              </div>
            </form>
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
};
