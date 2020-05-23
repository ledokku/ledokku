import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import { useCreateDatabaseMutation, DatabaseTypes } from '../generated/graphql';
import { OnboardingLayout } from '../layouts/OnboardingLayout';
import withApollo from '../lib/withApollo';
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
} from '../ui';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';
import { Protected } from '../modules/auth/Protected';
import { Link } from '../ui/components/Typography/components/Link';

const CreateDatabase = () => {
  const router = useRouter();
  const [createDatabaseMutation] = useCreateDatabaseMutation();
  const formik = useFormik<{ name: string; type: DatabaseTypes }>({
    initialValues: {
      name: '',
      type: 'POSTGRESQL',
    },
    onSubmit: async (values) => {
      // TODO validate name
      try {
        const data = await createDatabaseMutation({
          variables: {
            input: { name: values.name, type: values.type },
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

  // return null;

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
              selected={formik.values.type === 'POSTGRESQL'}
              label="PostgreSQL"
              icon={<PostgreSQLIcon size={40} />}
              onClick={() => formik.setFieldValue('type', 'POSTGRESQL')}
            />
            <BoxButton
              selected={formik.values.type === 'MYSQL'}
              label="MySQL"
              icon={<MySQLIcon size={40} />}
              disabled={true}
              onClick={() => formik.setFieldValue('type', 'MYSQL')}
            />
            <BoxButton
              selected={formik.values.type === 'MONGODB'}
              label="Mongo"
              icon={<MongoIcon size={40} />}
              disabled={true}
              onClick={() => formik.setFieldValue('type', 'MONGODB')}
            />
            <BoxButton
              selected={formik.values.type === 'REDIS'}
              label="Redis"
              icon={<RedisIcon size={40} />}
              disabled={true}
              onClick={() => formik.setFieldValue('type', 'REDIS')}
            />
          </Grid>
          {formik.values.type === 'POSTGRESQL' && (
            <Typography.Caption marginTop={8}>
              We currently only provide PostgreSQL
            </Typography.Caption>
          )}
          {formik.values.type === 'MYSQL' && (
            <Typography.Caption marginTop={8}>
              We currently don't support MySQL.
              <br />
              Take a look at{' '}
              <Link href="https://github.com/ledokku/ledokku/issues/22">
                the issue
              </Link>{' '}
              to track the progress.
            </Typography.Caption>
          )}
          {formik.values.type === 'MONGODB' && (
            <Typography.Caption marginTop={8}>
              We currently don't support Mongo.
              <br />
              Take a look at{' '}
              <Link href="https://github.com/ledokku/ledokku/issues/21">
                the issue
              </Link>{' '}
              to track the progress.
            </Typography.Caption>
          )}
          {formik.values.type === 'REDIS' && (
            <Typography.Caption marginTop={8}>
              We currently don't support Redis.
              <br />
              Take a look at{' '}
              <Link href="https://github.com/ledokku/ledokku/issues/20">
                the issue
              </Link>{' '}
              to track the progress.
            </Typography.Caption>
          )}
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
