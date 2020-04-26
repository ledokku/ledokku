import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import { useCreateDatabaseMutation } from '../../../generated/graphql';
import { OnboardingLayout } from '../../../layouts/OnboardingLayout';
import withApollo from '../../../lib/withApollo';
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
} from '../../../ui';
import { PostgreSQLIcon } from '../../../ui/icons/PostgreSQLIcon';
import { MySQLIcon } from '../../../ui/icons/MySQLIcon';
import { MongoIcon } from '../../../ui/icons/MongoIcon';
import { RedisIcon } from '../../../ui/icons/RedisIcon';
import { Protected } from '../../../modules/auth/Protected';

const CreateDatabase = () => {
  const router = useRouter();
  const { serverId } = router.query as { serverId: string };
  const [createDatabaseMutation] = useCreateDatabaseMutation();
  const formik = useFormik<{ name: string }>({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      // TODO validation token is required
      try {
        const data = await createDatabaseMutation({
          variables: {
            input: { name: values.name, serverId, type: 'POSTGRESQL' },
          },
        });
        router.push('/dashboard');
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
          id="name"
          name="name"
          label="Database name"
          value={formik.values.name}
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
            <BoxButton
              selected={true}
              label="PostgreSQL"
              icon={<PostgreSQLIcon size={40} />}
            />
            <BoxButton
              label="MySQL"
              icon={<MySQLIcon size={40} />}
              disabled={true}
            />
            <BoxButton
              label="Mongo"
              icon={<MongoIcon size={40} />}
              disabled={true}
            />
            <BoxButton
              label="Redis"
              icon={<RedisIcon size={40} />}
              disabled={true}
            />
          </Grid>
          <Typography.Caption marginTop={8}>
            We currently only provide PostgreSQL
          </Typography.Caption>
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

export default withApollo(() => (
  <Protected>
    <CreateDatabase />
  </Protected>
));
