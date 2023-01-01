import { Badge, Button, Image, Loading, Spacer, Text } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FiArrowRight } from 'react-icons/fi';
import * as yup from 'yup';
import { DockerIcon } from '../../ui/icons/DockerIcon';
import { GithubIcon } from '../../ui/icons/GithubIcon';
import { GitlabIcon } from '../../ui/icons/GitlabIcon';
import { AdminLayout } from '../../ui/layout/layout';
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

const SourceBox = ({ label, selected = false, icon, onClick, badge }: SourceBoxProps) => {
    return (
        <div
            className={`w-full border-solid p-12 flex flex-col border-3 items-center rounded-2xl ${selected ? "border-blue-500" : "border-gray-600"} ${onClick ? `grayscale-0 opacity-100 cursor-pointer hover:bg-[#7a7a7a1f]` : 'grayscale-1 opacity-50'
                }`}
            onClick={onClick}
        >
            <div className="h-12 mb-2">{icon}</div>
            <Text h3>{label}</Text>
            {badge}
        </div>
    );
};

const CreateApp = () => {
    const history = useRouter();
    const toast = useToast();

    const createAppSchema = yup.object({
        type: yup.string().oneOf(['GITHUB', 'GITLAB', 'DOCKER', 'DOKKU']).required(),
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
                    ? history.push('/app-creation/create-app-github')
                    : history.push('/app-creation/create-app-dokku');
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    return (
        <AdminLayout pageTitle='Crear aplicación'>
            <Text h2>
                Crear aplicación
            </Text>
            <div>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mt-4">
                            <Text className="text-gray-500 ">
                                Elige entre crear una aplicación desde un repositorio de Github o
                                una aplicación de Dokku.
                            </Text>
                            <Spacer y={1} />
                            <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                                <div className='w-full md:w-1/4'>
                                    <SourceBox
                                        selected={formik.values.type === AppTypes.GITHUB}
                                        label="GitHub"
                                        icon={<GithubIcon size={40} />}
                                        onClick={() =>
                                            formik.setFieldValue('type', AppTypes.GITHUB)
                                        }
                                    />
                                </div>
                                <div className='w-full md:w-1/4'>
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
                                        onClick={() => formik.setFieldValue('type', AppTypes.DOKKU)}
                                    />
                                </div>
                                <div className='w-full md:w-1/4'>
                                    <SourceBox
                                        selected={formik.values.type === AppTypes.GITLAB}
                                        label="Gitlab"
                                        icon={<GitlabIcon size={40} />}
                                        badge={<Badge color="error">Proximamente</Badge>}
                                    // Uncomment this when we can handle docker deployments
                                    // onClick={() => formik.setFieldValue('type', 'GITLAB')}
                                    />
                                </div>
                                <div className='w-full md:w-1/4'>
                                    <SourceBox
                                        selected={formik.values.type === AppTypes.DOCKER}
                                        label="Docker"
                                        icon={<DockerIcon size={40} />}
                                        badge={<Badge color="error">Proximamente</Badge>}
                                    // Uncomment this when we can handle docker deployments
                                    // onClick={() => formik.setFieldValue('type', 'DOCKER')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <Button
                                flat
                                disabled={!formik.values.type || !!formik.errors.type}
                                iconRight={<FiArrowRight size={20} />}
                                type="submit"
                            >
                                {!formik.isSubmitting ? (
                                    'Siguiente'
                                ) : (
                                    <Loading color="currentColor" type='points-opacity' />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateApp;
