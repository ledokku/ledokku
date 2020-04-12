import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ArrowRight } from 'react-feather';

import { useCreateDigitalOceanServerMutation } from '../../../src/generated/graphql';
import withApollo from '../../../lib/withApollo';
import { TextField, Button, styled, Flex, Box, BoxButton } from '../../../ui';
import { LoggedInLayout } from '../../../layouts/LoggedInLayout';

const CreateApp = () => {
  const router = useRouter();
  const [
    createDigitalOceanServerMutation,
  ] = useCreateDigitalOceanServerMutation();
  const formik = useFormik<{ gitUrl: string }>({
    initialValues: {
      gitUrl: '',
    },
    onSubmit: async (values) => {
      // TODO validation name is required
      try {
        const data = await createDigitalOceanServerMutation({
          variables: { serverName: values.gitUrl },
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
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Berlin Library Project',
        },
        {
          label: 'New App',
        },
      ]}
    >
      <Box
        margin={{
          desktop: 80,
          tablet: 40,
          phone: 24,
        }}
        marginLeft="auto"
        marginRight="auto"
        paddingLeft={{
          desktop: 80,
          tablet: 40,
          phone: 24,
        }}
        paddingRight={{
          desktop: 80,
          tablet: 40,
          phone: 24,
        }}
        width="100%"
        maxWidth={800}
      >
        <Form onSubmit={formik.handleSubmit}>
          <TextField
            id="gitUrl"
            name="gitUrl"
            label="Enter the git url of your new app"
            value={formik.values.gitUrl}
            onChange={formik.handleChange}
          />
          <Flex justifyContent="flex-end">
            <Button type="submit" background="primary" endIcon={<ArrowRight />}>
              Submit
            </Button>
          </Flex>
        </Form>
      </Box>
    </LoggedInLayout>
  );
};

const Form = styled.form`
  display: grid;
  grid-row-gap: 80px;

  @media ${({ theme }) => theme.media.phone} {
    grid-row-gap: 40px;
  }
`;

export default withApollo(CreateApp);
