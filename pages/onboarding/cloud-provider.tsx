import React from 'react';
import { useFormik } from 'formik';

import { useSaveDigitalOceanAccessTokenMutation } from '../../src/generated/graphql';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import { Button } from '../../ui/components/Button';
import { Headline } from '../../ui/components/Typography/components/Headline';
import { Paragraph } from '../../ui/components/Typography/components/Paragraph';
import withApollo from '../../lib/withApollo';

const CloudProvider = () => {
  const [
    saveDigitalOceanAccessTokenMutation,
  ] = useSaveDigitalOceanAccessTokenMutation();
  const formik = useFormik<{ token: string }>({
    initialValues: {
      token: '',
    },
    onSubmit: async (values) => {
      // TODO validation token is required
      try {
        const data = await saveDigitalOceanAccessTokenMutation({
          variables: { digitalOceanAccessToken: values.token },
        });
        console.log(data);
        // TODO if successful redirect to next step
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
          label: 'Pick your cloud provider',
        },
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        <p>Enter your token</p>
        <input
          id="token"
          name="token"
          value={formik.values.token}
          onChange={formik.handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </OnboardingLayout>
  );
};

export default withApollo(CloudProvider);
