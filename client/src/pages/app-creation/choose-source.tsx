import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Heading,
  Text,
  Button,
  Box,
  Grid,
  Image,
  Badge,
} from '@chakra-ui/react';
import { ArrowRight } from 'react-feather';

import { Header } from '../../modules/layout/Header';

import { HeaderContainer } from '../../ui';
import { useToast } from '../../ui/toast';
import { GithubIcon } from '../../ui/icons/GithubIcon';
import { GitlabIcon } from '../../ui/icons/GitlabIcon';
import { DockerIcon } from '../../ui/icons/DockerIcon';

interface SourceBoxProps {
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  onClick?(): void;
}

export enum AppTypes {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  DOKKU = 'DOKKU',
  DOCKER = 'DOCKER',
}

const SourceBox = ({
  label,
  selected,
  icon,
  onClick,
  badge,
}: SourceBoxProps) => {
  return (
    <Box
      p="12"
      display="flex"
      flexDirection="column"
      alignItems="center"
      border="1px"
      borderColor={selected ? 'black' : 'gray.300'}
      opacity={selected ? '100%' : '50%'}
      cursor="pointer"
      borderRadius="base"
      onClick={onClick}
    >
      <Box mb="2">{icon}</Box>
      <p>{label}</p>
      {badge}
    </Box>
  );
};

export const ChooseSource = () => {
  const history = useHistory();
  const toast = useToast();

  const chooseSourceSchema = yup.object({
    type: yup
      .string()
      .oneOf(['GITHUB', 'GITLAB', 'DOCKER', 'DOKKU'])
      .required(),
  });

  const formik = useFormik<{ type: AppTypes }>({
    initialValues: {
      type: AppTypes.GITHUB,
    },
    validateOnChange: true,
    validationSchema: chooseSourceSchema,
    onSubmit: async (values) => {
      try {
        values.type === AppTypes.GITHUB
          ? history.push('/create-app-github')
          : history.push('/create-app-dokku');
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <HeaderContainer>
        <Header />
      </HeaderContainer>

      <Container maxW="5xl" my="4">
        <Heading py="2" as="h2" size="md">
          App source
        </Heading>
        <Box mt="24">
          <Box mt="4">
            <form onSubmit={formik.handleSubmit}>
              <Box mt="20">
                <Text mb="5" color="gray.500">
                  Choose between creating app from a Github repository or
                  creating a standalone Dokku app.
                </Text>
                <Grid
                  templateColumns={{
                    base: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))',
                  }}
                  gap="4"
                >
                  <SourceBox
                    selected={formik.values.type === AppTypes.GITHUB}
                    label="GitHub"
                    icon={<GithubIcon size={40} />}
                    onClick={() => formik.setFieldValue('type', 'GITHUB')}
                  />
                  <SourceBox
                    selected={formik.values.type === AppTypes.DOKKU}
                    label="Dokku"
                    icon={
                      <Image
                        boxSize="48px"
                        objectFit="cover"
                        src="https://alternative.me/media/256/dokku-icon-2rtcs9lztuk6iud7-c.png"
                        alt="dokkuLogo"
                      />
                    }
                    onClick={() => formik.setFieldValue('type', 'DOKKU')}
                  />
                  <SourceBox
                    selected={formik.values.type === AppTypes.GITLAB}
                    label="Gitlab"
                    icon={<GitlabIcon size={40} />}
                    badge={
                      <Badge ml="1" colorScheme="red">
                        Coming soon
                      </Badge>
                    }
                    // Uncomment this when we can handle docker deployments
                    // onClick={() => formik.setFieldValue('type', 'GITLAB')}
                  />
                  <SourceBox
                    selected={formik.values.type === AppTypes.DOCKER}
                    label="Docker"
                    icon={<DockerIcon size={40} />}
                    badge={
                      <Badge ml="1" colorScheme="red">
                        Coming soon
                      </Badge>
                    }
                    // Uncomment this when we can handle docker deployments
                    // onClick={() => formik.setFieldValue('type', 'DOCKER')}
                  />
                </Grid>
              </Box>

              <Box mt="36" display="flex" justifyContent="flex-end">
                <Button
                  isLoading={formik.isSubmitting}
                  disabled={!formik.values.type || !!formik.errors.type}
                  rightIcon={<ArrowRight />}
                  type="submit"
                >
                  Next
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
};
