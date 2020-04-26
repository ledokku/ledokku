import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ArrowRight } from 'react-feather';

import { useCreateDigitalOceanServerMutation } from '../../generated/graphql';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import { Headline } from '../../ui/components/Typography/components/Headline';
import { Paragraph } from '../../ui/components/Typography/components/Paragraph';
import withApollo from '../../lib/withApollo';
import {
  TextField,
  Button,
  styled,
  Flex,
  Typography,
  Box,
  BoxButton,
  Grid,
} from '../../ui';

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
        router.push(`/server/${data.data.createDigitalOceanServer.id}`);
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
      <Form onSubmit={formik.handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Enter a name for your new server"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <Flex justifyContent="flex-end">
          <Button type="submit" background="primary" endIcon={<ArrowRight />}>
            Submit
          </Button>
        </Flex>
      </Form>
    </OnboardingLayout>
  );
};

const Form = styled.form`
  display: grid;
  grid-row-gap: 80px;

  @media ${({ theme }) => theme.media.phone} {
    grid-row-gap: 40px;
  }
`;

export default withApollo(CreateServer);
