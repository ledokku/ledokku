import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button, Input, Loading, Modal, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useAddAppProxyPortMutation } from '../../../generated/graphql';
import { useToast } from '../../toast';

const createAppProxyPortSchema = yup.object().shape({
    host: yup.string().required('El puerto del anfitrion es requerido'),
    container: yup.string().required('El puerto del contenedor es requerido'),
});

interface AddAppProxyPortsProps {
    appId: string;
    open: boolean;
    onClose: () => void;
}

export const AddAppProxyPorts = ({
    appId,
    open,
    onClose,
}: AddAppProxyPortsProps) => {
    const [addAppProxyPortMutation] = useAddAppProxyPortMutation();
    const toast = useToast();
    const router = useRouter();
    const formik = useFormik<{ host: string; container: string }>({
        initialValues: {
            host: '',
            container: '',
        },
        validateOnChange: true,
        validationSchema: createAppProxyPortSchema,
        onSubmit: async (values) => {
            try {
                await addAppProxyPortMutation({
                    variables: {
                        input: {
                            appId,
                            host: values.host,
                            container: values.container,
                        },
                    },
                });
                router.reload();
                toast.success('Mapeo de puertos creado');

                onClose();
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    if (!open) {
        return null;
    }

    return (
        <Modal open={open} onClose={onClose} blur closeButton>
            <Modal.Header>
                <Text h4>Agregar mapeo de puertos</Text>
            </Modal.Header>
            <Modal.Body>
                <Input
                    css={{ marginBottom: 0 }}
                    name="host"
                    label="Puerto del anfitrion (host)"
                    value={formik.values.host}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <Text color="$error">{formik.errors.host}</Text>

                <Input
                    css={{ marginBottom: 0 }}
                    name="container"
                    label="Puerto del contenedor"
                    value={formik.values.container}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <Text color="$error">{formik.errors.container}</Text>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} bordered color="error" size="sm">
                    Cancelar
                </Button>
                <Button
                    size="sm"
                    disabled={!!formik.errors.host || !!formik.errors.container}
                    onClick={() => formik.handleSubmit()}
                >
                    {formik.isSubmitting ? <Loading color="currentColor" size="sm" type='points-opacity' /> : 'Crear'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
