import React, { useState } from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../../lib/withApollo';

import { Protected } from '../../../modules/auth/Protected';
import { Header } from '../../../modules/layout/Header';
import {
  useAppByIdQuery,
  useEnvVarsQuery,
  useSetEnvVarMutation,
  EnvVarsDocument,
} from '../../../generated/graphql';
import { useFormik } from 'formik';
import { TabNav, TabNavLink, Button } from '../../../ui';

interface EnvFormProps {
  name: string;
  value: string;
  appId: string;
  isNewVar?: boolean;
}

const EnvForm = ({ name, value, appId, isNewVar }: EnvFormProps) => {
  const [isEnvVarVisible, setEnvVarIsVisible] = useState(false);
  const [setEnvVarMutation] = useSetEnvVarMutation();
  const formik = useFormik<{ name: string; value: string }>({
    initialValues: {
      name,
      value,
    },
    onSubmit: async (values) => {
      // TODO validate values
      try {
        const data = await setEnvVarMutation({
          variables: { key: values.name, value: values.value, appId },
          refetchQueries: [{ query: EnvVarsDocument, variables: { appId } }],
        });

        if (isNewVar) {
          formik.resetForm();
        }

        // TODO give feedback about setting success
        console.log(data);
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  return (
    //TODO Handle visual feedback on changing env
    //TODO Provide infos about env vars
    <form onSubmit={formik.handleSubmit} className="mt-2">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <div className="mt-8">
          <input
            autoComplete="off"
            className="inline w-full  max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
            id={isNewVar ? 'newVarName' : name}
            name="name"
            placeholder="Name"
            key={name}
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <div className="mt-8 ">
          <input
            autoComplete="off"
            className="inline w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
            id={isNewVar ? 'newVarValue' : value}
            name="value"
            placeholder="Value"
            key={value}
            value={formik.values.value}
            onChange={formik.handleChange}
            type={isEnvVarVisible ? 'text' : 'password'}
          />
        </div>
        <div className="flex items-end">
          {}
          <svg
            onClick={() => setEnvVarIsVisible(!isEnvVarVisible)}
            className={
              isEnvVarVisible
                ? 'fill-current text-red-500 h-8 w-8 mt-2 -ml-1.5 mr-5 mb-2'
                : 'fill-current text-gray-900 h-8 w-8 mt-2 -ml-1.5 mr-5 mb-2'
            }
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M.2 10a11 11 0 0 1 19.6 0A11 11 0 0 1 .2 10zm9.8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
          <Button size="normal" isSubmit={true} color="grey">
            {isNewVar ? 'Add' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
};

const Env = () => {
  const router = useRouter();
  // // On first render appId will be undefined, the value is set after and a rerender is triggered.
  const { appId } = router.query as { appId?: string };
  const { data, loading, error } = useAppByIdQuery({
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
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav>
          <TabNavLink href="/app/[appId]" as={`/app/${app.id}`} passHref>
            App
          </TabNavLink>
          <TabNavLink
            href="/app/[appId]/env"
            as={`/app/${app.id}/env`}
            passHref
            selected
          >
            Env setup
          </TabNavLink>
          <TabNavLink
            href="/app/[appId]/settings"
            as={`/app/${app.id}/settings`}
            passHref
          >
            Settings
          </TabNavLink>
          <TabNavLink href="/dashboard" passHref>
            Return to dashboard
          </TabNavLink>
        </TabNav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mt-16 text-lg font-semibold">Set env variables</h1>
        <div className="mt-4 mb-4">
          <h2 className="text-gray-400">
            Before modifying any of these, make sure you are familiar with dokku
            env vars
          </h2>
        </div>

        {!envVarLoading &&
          !envVarError &&
          envVarData.envVars &&
          envVarData.envVars.envVars && (
            <React.Fragment>
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
            </React.Fragment>
          )}
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Env />
  </Protected>
));
