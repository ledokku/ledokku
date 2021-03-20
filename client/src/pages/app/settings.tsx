import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useDestroyAppMutation,
  DashboardDocument,
} from '../../generated/graphql';
import { useFormik } from 'formik';
import { HeaderContainer } from '../../ui';
import { AppProxyPorts } from '../../modules/appProxyPorts/AppProxyPorts';
import { AppRestart } from '../../modules/app/AppRestart';
import { AppRebuild } from '../../modules/app/AppRebuild';
import { AppDomains } from '../../modules/domains/AppDomains';
import { Webhooks } from '../../modules/webhooks/Webhooks';
import { useToast } from '../../ui/toast';
import { AppHeaderTabNav } from '../../modules/app/AppHeaderTabNav';

export const Settings = () => {
  const { id: appId } = useParams<{ id: string }>();
  const toast = useToast();
  let history = useHistory();
  const [
    destroyAppMutation,
    { loading: destroyAppMutationLoading },
  ] = useDestroyAppMutation();

  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

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

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <p>Loading...</p>;
  }

  const { app } = data;

  if (!app) {
    // TODO nice 404
    return <p>App not found.</p>;
  }

  return (
    <div>
      <HeaderContainer>
        <Header />
        <AppHeaderTabNav app={app} />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <SimpleGrid columns={{ sm: 1, md: 2 }}>
          <div>
            <Box py={5}>
              <Heading as="h2" size="md">
                App settings
              </Heading>
              <Text fontSize="sm" color="gray.400">
                Update the settings of your app.
              </Text>
            </Box>
            {!loading && data?.app?.appMetaGithub?.webhooksSecret && (
              <Webhooks appId={app.id} />
            )}
            <AppProxyPorts appId={app.id} />
            <AppRestart appId={app.id} />
            <AppRebuild appId={app.id} />
            <AppDomains appId={appId} />

            <Box py="5">
              <Text fontSize="md" fontWeight="bold">
                Delete app
              </Text>
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
          </div>
        </SimpleGrid>
      </Container>
    </div>
  );
};
