import React from 'react';
import { useRouter } from 'next/router';

import withApollo from '../../../lib/withApollo';

import { Protected } from '../../../modules/auth/Protected';
import { Header } from '../../../modules/layout/Header';
import {
  useAppByIdQuery,
  useEnvVarsQuery,
  useSetEnvVarMutation,
} from '../../../generated/graphql';
import Link from 'next/link';
import { useFormik } from 'formik';

interface EnvFormProps {
  name: string;
  value: string;
  appId: string;
}

const EnvForm = ({ name, value, appId }: EnvFormProps) => {
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
        });
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
            className="inline w-full  max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
            id="name"
            name="namew"
            placeholder="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <div className="mt-8">
          <input
            className="inline w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
            id="value"
            name="value"
            placeholder="Value"
            value={formik.values.value}
            onChange={formik.handleChange}
          />
        </div>
        <div className="flex items-end">
          <button className="inline py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white border hover:border-transparent rounded-lg">
            Save
          </button>
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
        <nav className="flex space-x-5 text-sm leading-5 border-b border-gray-200">
          <Link href="/app/[appId]" as={`/app/${app.id}`} passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              App
            </a>
          </Link>
          <Link href="/app/[appId]/env" as={`/app/${app.id}/env`} passHref>
            <a className="-mb-px border-b border-black text-black py-3 px-0.5">
              Env setup
            </a>
          </Link>
          <Link
            href="/app/[appId]/settings"
            as={`/app/${app.id}/settings`}
            passHref
          >
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-150">
              Settings
            </a>
          </Link>
          <Link href="/dashboard" passHref>
            <a className="text-gray-500 hover:text-black py-3 px-0.5 transition-colors ease-in-out duration-15">
              Return to dashboard
            </a>
          </Link>
        </nav>
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
          envVarData.envVars.envVars &&
          envVarData.envVars.envVars.map((envVar) => {
            return (
              <EnvForm
                key={envVar.key}
                name={envVar.key}
                value={envVar.value}
                appId={appId}
              />
            );
          })}
      </div>
    </div>
  );
};

export default withApollo(() => (
  <Protected>
    <Env />
  </Protected>
));
