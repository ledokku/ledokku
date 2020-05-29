import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ArrowRight } from 'react-feather';

import { useCreateAppMutation } from '../generated/graphql';
import withApollo from '../lib/withApollo';

import { Protected } from '../modules/auth/Protected';
import { Header } from '../modules/layout/Header';

const CreateApp = () => {
  const router = useRouter();
  const [createAppMutation] = useCreateAppMutation();
  const formik = useFormik<{ name: string; gitUrl: string }>({
    initialValues: {
      name: '',
      gitUrl: '',
    },
    onSubmit: async (values) => {
      // TODO validate name
      try {
        const data = await createAppMutation({
          variables: {
            name: values.name,
            gitUrl: values.gitUrl,
          },
        });
        // TODO give feedback about app being deployed
        router.push('/dashboard');
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
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
            Enter app name and link to your github repository. Click create and
            voila!
          </h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-2">
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            <div className="mt-8">
              <input
                className="inline w-full  max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
                id="name"
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <div className="mt-8">
              <input
                className="inline w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
                id="gitUrl"
                name="gitUrl"
                placeholder="Git url"
                value={formik.values.gitUrl}
                onChange={formik.handleChange}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="inline flex justify-end py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold hover:text-white border hover:border-transparent rounded-lg"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default withApollo(() => (
  <Protected>
    <CreateApp />
  </Protected>
));
