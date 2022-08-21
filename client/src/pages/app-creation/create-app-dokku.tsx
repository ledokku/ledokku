import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { trackGoal } from 'fathom-client';
import * as yup from 'yup';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import {
  useCreateAppDokkuMutation,
  useAppsQuery,
} from '../../generated/graphql';
import { Header } from '../../modules/layout/Header';
import { HeaderContainer } from '../../ui';
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
      } catch (error: any) {
        toast.error(error);
      }
    },
  });

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Heading as="h2" size="md">
          Create a new app
        </Heading>

        <Text mt="12" mb="4" color="gray.400">
          Enter app name, click create and voila!
        </Text>

        <Grid templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}>
          <GridItem colSpan={2}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                id="v"
                isInvalid={Boolean(formik.errors.name && formik.touched.name)}
              >
                <FormLabel>App name:</FormLabel>
                <Input
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>

              <Box mt="4" display="flex" justifyContent="flex-end">
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
              </Box>
            </form>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};
