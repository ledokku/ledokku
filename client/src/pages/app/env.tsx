import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../modules/layout/Header';
import {
  useAppByIdQuery,
  useEnvVarsQuery,
  useSetEnvVarMutation,
  useUnsetEnvVarMutation,
  EnvVarsDocument,
} from '../../generated/graphql';
import { useFormik } from 'formik';
import { HeaderContainer } from '../../ui';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
  Input,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { useToast } from '../../ui/toast';
import { AppHeaderTabNav } from '../../modules/app/AppHeaderTabNav';
import { AppHeaderInfo } from '../../modules/app/AppHeaderInfo';

interface EnvFormProps {
  name: string;
  value: string;
  appId: string;
  isNewVar?: boolean;
}

export const EnvForm = ({ name, value, appId, isNewVar }: EnvFormProps) => {
  const [inputType, setInputType] = useState('password');
  const toast = useToast();
  const [
    setEnvVarMutation,
    { loading: setEnvVarLoading },
  ] = useSetEnvVarMutation();
  const [
    unsetEnvVarMutation,
    { loading: unsetEnvVarLoading },
  ] = useUnsetEnvVarMutation();

  const handleDeleteEnvVar = async (event: any) => {
    event.preventDefault();
    try {
      await unsetEnvVarMutation({
        variables: { key: name, appId },
        refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formik = useFormik<{ name: string; value: string }>({
    initialValues: {
      name,
      value,
    },
    onSubmit: async (values) => {
      // TODO validate values
      try {
        await setEnvVarMutation({
          variables: { key: values.name, value: values.value, appId },
          refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
        });

        if (isNewVar) {
          formik.resetForm();
        }
        toast.success('Environment variable set successfully');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    //TODO Handle visual feedback on changing env
    //TODO Provide infos about env vars
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <Grid
        templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap="3"
        mt="3"
      >
        <GridItem>
          <Input
            autoComplete="off"
            id={isNewVar ? 'newVarName' : name}
            name="name"
            placeholder="Name"
            key={name}
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </GridItem>
        <GridItem>
          <Input
            autoComplete="off"
            onMouseEnter={() => setInputType('text')}
            onMouseLeave={() => setInputType('password')}
            onFocus={() => setInputType('text')}
            onBlur={() => setInputType('password')}
            id={isNewVar ? 'newVarValue' : value}
            name="value"
            placeholder="Value"
            key={value}
            value={formik.values.value}
            onChange={formik.handleChange}
            type={inputType}
          />
        </GridItem>
        <GridItem display="flex">
          <Button isLoading={setEnvVarLoading} type="submit">
            {isNewVar ? 'Add' : 'Save'}
          </Button>
          {!isNewVar && (
            <IconButton
              aria-label="Delete"
              variant="outline"
              ml="3"
              icon={<FiTrash2 />}
              isLoading={unsetEnvVarLoading}
              onClick={handleDeleteEnvVar}
            />
          )}
        </GridItem>
      </Grid>
    </form>
  );
};

export const Env = () => {
  const { id: appId } = useParams<{ id: string }>();
  const { data, loading /* error */ } = useAppByIdQuery({
    variables: {
      appId,
    },
    ssr: false,
    skip: !appId,
  });

  const {
    data: envVarData,
    loading: envVarLoading,
    error: envVarError,
  } = useEnvVarsQuery({
    variables: {
      appId,
    },
    fetchPolicy: 'network-only',
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
        <AppHeaderInfo app={app} />
        <AppHeaderTabNav app={app} />
      </HeaderContainer>

      <Container maxW="5xl" mt={10}>
        <Box py="5">
          <Heading as="h2" size="md">
            Set env variables
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Environment variables change the way your app behaves. They are
            available both at run time and during the application
            build/compilation step for buildpack-based deploys.{' '}
            <Link
              textDecoration="underline"
              href="https://dokku.com/docs/configuration/environment-variables/"
              isExternal
            >
              Read more.
            </Link>
          </Text>
        </Box>

        {!envVarLoading && !envVarError && envVarData?.envVars.envVars && (
          <Box mb="8">
            {envVarData.envVars.envVars.map((envVar) => {
              return (
                <EnvForm
                  key={envVar.key}
                  name={envVar.key}
                  value={envVar.value}
                  appId={appId}
                />
              );
            })}
            <EnvForm
              key="newVar"
              name=""
              value=""
              appId={appId}
              isNewVar={true}
            />
          </Box>
        )}
      </Container>
    </div>
  );
};
