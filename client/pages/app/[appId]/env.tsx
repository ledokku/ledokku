import { Button, Divider, Grid, Input, Link, Loading, Text, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import {
  EnvVarsDocument, useAppByIdQuery,
  useEnvVarsQuery,
  useSetEnvVarMutation,
  useUnsetEnvVarMutation
} from '../../../generated/graphql';
import { LoadingSection } from '../../../ui/components/LoadingSection';
import { AdminLayout } from '../../../ui/layout/layout';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';
import { useToast } from '../../../ui/toast';

interface EnvFormProps {
  name: string;
  value: string;
  appId: string;
  isNewVar?: boolean;
}

const EnvForm = ({ name, value, appId, isNewVar }: EnvFormProps) => {
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
    // event.preventDefault();
    try {
      await unsetEnvVarMutation({
        variables: { key: name, appId },
        refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
      });
      toast.success('Variable de entorno eliminada');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const formik = useFormik<{ name: string; value: string }>({
    initialValues: {
      name,
      value,
    },
    onSubmit: async (values) => {
      try {
        await setEnvVarMutation({
          variables: { key: values.name, value: values.value, appId },
          refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
        });

        if (isNewVar) {
          formik.resetForm();
        }
        toast.success('Variable de entorno asignada');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <Grid.Container gap={1} direction="column">
        <Grid xs md={6}>
          <Input
            width='100%'
            autoComplete="off"
            id={isNewVar ? 'newVarName' : name}
            name="name"
            placeholder="Nombre"
            label='Nombre'
            key={name}
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid xs md={6}>
          <Textarea
            width='100%'
            autoComplete="off"
            onMouseEnter={() => setInputType('text')}
            onMouseLeave={() => setInputType('password')}
            onFocus={() => setInputType('text')}
            onBlur={() => setInputType('password')}
            id={isNewVar ? 'newVarValue' : value}
            name="value"
            placeholder="Valor"
            label='Valor'
            key={value}
            value={formik.values.value}
            onChange={formik.handleChange}
          // type={inputType}
          />
        </Grid>
        <Grid className='flex flex-row'>
          <Button type="submit" className='mr-4'>
            {setEnvVarLoading ? <Loading color="currentColor" size='sm' /> : isNewVar ? 'Agregar' : 'Guardar'}
          </Button>
          {!isNewVar && (
            <Button
              css={{ minWidth: "0px" }}
              color="error"
              aria-label="Delete"
              disabled={unsetEnvVarLoading}
              icon={unsetEnvVarLoading ? <Loading color="currentColor" /> : <FiTrash2 />}
              onClick={handleDeleteEnvVar}
            />
          )}
        </Grid>
      </Grid.Container>
    </form >
  );
};

const Env = () => {
  const history = useRouter();
  const appId = history.query.appId as string;
  const { data, loading } = useAppByIdQuery({
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


  if (loading) {
    return <LoadingSection />;
  }

  const { app } = data;

  if (!app) {
    return <p>App not found.</p>;
  }

  return (
    <AdminLayout>
      <div>
        <AppHeaderInfo app={app} />
        <AppHeaderTabNav app={app} />
      </div>
      <div className='my-6'>
        <Text h3>
          Configurar variables de entorno
        </Text>
        <Text>
          Las variables de entorno cambian la manera en la que la aplicación se comporta.
          Estan disponibles tanto en tiempo de ejecución como en compilación para lanzamientos
          basados en buildpack.{' '}
          <Link
            href="https://dokku.com/docs/configuration/environment-variables/"
            isExternal
            css={{ display: 'inline' }}
          >
            Leer más
          </Link>
        </Text>
      </div>

      {!envVarLoading && !envVarError && envVarData?.envVars.envVars && (
        <div>
          {envVarData.envVars.envVars.map((envVar, index) => {
            return (
              <div key={index}>
                <EnvForm
                  key={envVar.key}
                  name={envVar.key}
                  value={envVar.value}
                  appId={appId}
                />
                <div className='my-8'>
                  <Divider />
                </div>
              </div>
            );
          })}
          <EnvForm
            key="newVar"
            name=""
            value=""
            appId={appId}
            isNewVar={true}
          />
        </div>
      )}
    </AdminLayout>
  );
};


export default Env;