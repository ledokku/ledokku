import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import { useSaveDigitalOceanAccessTokenMutation } from '../../src/generated/graphql';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import withApollo from '../../lib/withApollo';
import { ArrowRight } from 'react-feather';
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
import { DigitalOceanIcon } from '../../ui/icons/DigitalOceanIcon';
import { LinodeIcon } from '../../ui/icons/LinodeIcon';
import { AWSIcon } from '../../ui/icons/AWSIcon';

const CloudProvider = () => {
  const router = useRouter();
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
        router.push('/onboarding/create-server');
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
          label: 'Create a new database',
        },
      ]}
    >
      <Form onSubmit={formik.handleSubmit}>
        <TextField
          id="token"
          name="token"
          label="Database name"
          value={formik.values.token}
          onChange={formik.handleChange}
        />
        <Box>
          <Typography.Label marginBottom={24}>
            Choose your database
          </Typography.Label>
          <Grid
            templateColumns={{
              desktop: '1fr 1fr 1fr 1fr',
              tablet: '1fr 1fr 1fr',
              phone: '1fr 1fr',
            }}
            columnGap={16}
            rowGap={16}
          >
            <BoxButton selected={true} label="PostgreSQL" />
            <BoxButton label="MySQL" disabled={true} />
            <BoxButton label="Mongo" disabled={true} />
            <BoxButton label="Redis" disabled={true} />
          </Grid>
        </Box>
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

export default withApollo(CloudProvider);
