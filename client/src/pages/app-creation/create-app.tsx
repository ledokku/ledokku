import { Badge, Button, Grid, Image, Loading, Spacer, Text, useTheme } from '@nextui-org/react';
import { useFormik } from 'formik';
import { FiArrowRight } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { DockerIcon } from '../../ui/icons/DockerIcon';
import { GithubIcon } from '../../ui/icons/GithubIcon';
import { GitlabIcon } from '../../ui/icons/GitlabIcon';
import { useToast } from '../../ui/toast';

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
  const { theme } = useTheme();
  return (
    <div
      className={`w-full p-12 flex flex-col items-center border-2 rounded-lg  ${onClick ? 'grayscale-0 opacity-100 cursor-pointer' : 'grayscale  opacity-50'}`}
      onClick={onClick}
      style={
        {
          borderColor: selected ? theme?.colors.primary.value : theme?.colors.border.value
        }
      }
    >
      <div className='mb-2 h-12'>{icon}</div>
      <Text h3>{label}</Text>
      {badge}
    </div>
  );
};

export const CreateApp = () => {
  const history = useHistory();
  const toast = useToast();

  const createAppSchema = yup.object({
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
    validationSchema: createAppSchema,
    onSubmit: async (values) => {
      try {
        values.type === AppTypes.GITHUB
          ? history.push('/create-app-github')
          : history.push('/create-app-dokku');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <Text h2 className='mt-16'>
        Crear aplicación
      </Text>
      <div>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className='mt-4'>
              <Text className=' text-gray-500'>
                Elige entre crear una aplicación desde un repositorio de Github o una aplicación de Dokku.
              </Text>
              <Spacer y={3} />
              <Grid.Container
                gap={4}
              >
                <Grid md={3} xs={6}>
                  <SourceBox
                    selected={formik.values.type === AppTypes.GITHUB}
                    label="GitHub"
                    icon={<GithubIcon size={40} />}
                    onClick={() => formik.setFieldValue('type', 'GITHUB')}
                  />
                </Grid>
                <Grid md={3} xs={6}>
                  <SourceBox
                    selected={formik.values.type === AppTypes.DOKKU}
                    label="Dokku"
                    icon={
                      <Image
                        width={48}
                        objectFit="cover"
                        src="/dokku.png"
                        alt="dokkuLogo"
                      />
                    }
                    onClick={() => formik.setFieldValue('type', 'DOKKU')}
                  />
                </Grid>
                <Grid md={3} xs={6}>
                  <SourceBox
                    selected={formik.values.type === AppTypes.GITLAB}
                    label="Gitlab"
                    icon={<GitlabIcon size={40} />}
                    badge={
                      <Badge color="error">
                        Proximamente
                      </Badge>
                    }
                  // Uncomment this when we can handle docker deployments
                  // onClick={() => formik.setFieldValue('type', 'GITLAB')}
                  />
                </Grid>
                <Grid md={3} xs={6}>
                  <SourceBox
                    selected={formik.values.type === AppTypes.DOCKER}
                    label="Docker"
                    icon={<DockerIcon size={40} />}
                    badge={
                      <Badge color="error">
                        Proximamente
                      </Badge>
                    }
                  // Uncomment this when we can handle docker deployments
                  // onClick={() => formik.setFieldValue('type', 'DOCKER')}
                  />
                </Grid>
              </Grid.Container>
            </div>

            <div className='mt-36 flex justify-end'>
              <Button
                flat
                disabled={!formik.values.type || !!formik.errors.type}
                iconRight={<FiArrowRight size={20} />}
                type="submit"
              >
                {!formik.isSubmitting ? "Siguiente" : <Loading color="currentColor" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
