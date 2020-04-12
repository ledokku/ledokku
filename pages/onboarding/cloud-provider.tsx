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
          label: 'Pick your cloud provider',
        },
      ]}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Box>
          <Typography.Label marginBottom={24}>
            Choose your first cloud provider
          </Typography.Label>
          <Grid
            templateColumns={{
              desktop: '1fr 1fr 1fr',
              tablet: '1fr 1fr 1fr',
              phone: '1fr 1fr',
            }}
            columnGap={16}
            rowGap={16}
          >
            <BoxButton selected={true} label="Digital Ocean" />
            <BoxButton label="Linode" disabled={true} />
            <BoxButton label="Amazon Web Services" disabled={true} />
          </Grid>
          <Typography.Caption marginTop={8}>
            We currently only provide Digital Ocean as an option of cloud
            provider
          </Typography.Caption>
          <Typography.Caption marginTop={8}>
            If you are a new DigitalOcean user, you will receive $100 Free
            Credit once you sign up for the first two months.
          </Typography.Caption>
        </Box>
        <TextField
          id="token"
          name="token"
          label="Enter your access token"
          value={formik.values.token}
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

export default withApollo(CloudProvider);
