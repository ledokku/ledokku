import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import { useCreateDigitalOceanServerMutation } from '../../src/generated/graphql';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import { Button } from '../../ui/components/Button';
import { Headline } from '../../ui/components/Typography/components/Headline';
import { Paragraph } from '../../ui/components/Typography/components/Paragraph';
import withApollo from '../../lib/withApollo';

const CreateServer = () => {
  const router = useRouter();
  const [
    createDigitalOceanServerMutation,
  ] = useCreateDigitalOceanServerMutation();
  const formik = useFormik<{ name: string }>({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      // TODO validation name is required
      try {
        const data = await createDigitalOceanServerMutation({
          variables: { serverName: values.name },
        });
        console.log(data);
        // TODO if successful redirect to next step
        // router.push(`/server/${}`);
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  return (
    <OnboardingLayout
      breadcrumb={[
        {
          label: 'Create a new server',
        },
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        <p>Enter a name for your new server</p>
        <input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </OnboardingLayout>
  );
};

export default withApollo(CreateServer);
