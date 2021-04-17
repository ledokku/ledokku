import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  Button,
  Heading,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router';
import {
  DashboardDocument,
  useAppByIdQuery,
  useDestroyAppMutation,
} from '../../../generated/graphql';
import { AppHeaderInfo } from '../../../modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../modules/app/AppHeaderTabNav';
import { AppRebuild } from '../../../modules/app/AppRebuild';
import { AppRestart } from '../../../modules/app/AppRestart';
import { AppSettingsMenu } from '../../../modules/app/AppSettingsMenu';
import { Header } from '../../../modules/layout/Header';
import { Webhooks } from '../../../modules/webhooks/Webhooks';
import { HeaderContainer } from '../../../ui';
import { useToast } from '../../../ui/toast';
import { config } from '../../../config';

export const AppSettingsAdvanced = () => {
  const { id: appId } = useParams<{ id: string }>();
  const toast = useToast();
  const history = useHistory();

  const { data, loading } = useAppByIdQuery({
    variables: {
      appId,
    },
  });

  const [
    destroyAppMutation,
    { loading: destroyAppMutationLoading },
  ] = useDestroyAppMutation();

  const DeleteAppNameSchema = yup.object().shape({
    appName: yup
      .string()
      .required('Required')
      .test(
        'Equals app name',
        'Must match app name',
        (val) => val === data?.app?.name
      ),
  });

  const formik = useFormik<{ appName: string }>({
    initialValues: {
      appName: '',
    },

    validateOnChange: true,
    validationSchema: DeleteAppNameSchema,

    onSubmit: async (values) => {
      try {
        await destroyAppMutation({
          variables: {
            input: { appId },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        toast.success('App deleted successfully');

        history.push('/dashboard');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  if (!data?.app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  const { app } = data;

  return (
    <>
      <HeaderContainer>
        <Header />
        <AppHeaderInfo app={app} />
        <AppHeaderTabNav app={app} />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Grid
          templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(6, 1fr)' }}
          gap={{ sm: 0, md: 16 }}
        >
          <GridItem colSpan={2} py={5}>
            <AppSettingsMenu app={app} />
          </GridItem>
          <GridItem colSpan={4}>
            {!loading && config.githubWebhooksSecret && (
              <Webhooks appId={app.id} />
            )}
            <AppRestart appId={app.id} />
            <AppRebuild appId={app.id} />

            <Box py="5">
              <Heading as="h2" size="md">
                Delete app
              </Heading>
              <Text fontSize="sm" color="gray.400">
                This action cannot be undone. This will permanently delete{' '}
                {app.name} app and everything related to it. Please type{' '}
                <b>{app.name}</b> to confirm deletion.
              </Text>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <FormControl
                id="appName"
                isInvalid={Boolean(
                  formik.errors.appName && formik.touched.appName
                )}
              >
                <Input
                  autoComplete="off"
                  id="appNme"
                  name="appName"
                  placeholder="App name"
                  value={formik.values.appName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.appName}</FormErrorMessage>
              </FormControl>

              <Button
                my={4}
                type="submit"
                colorScheme="red"
                isLoading={destroyAppMutationLoading}
              >
                Delete
              </Button>
            </form>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};
