import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAddAppProxyPortMutation } from '../../generated/graphql';
import {
  FormHelper,
  FormInput,
  FormLabel,
  Modal,
  ModalButton,
  ModalDescription,
  ModalTitle,
} from '../../ui';

const createAppProxyPortSchema = yup.object().shape({
  host: yup.string().required('Host port is required'),
  container: yup.string().required('Container port is required'),
});

interface AddAppProxyPortsProps {
  appId: string;
  appProxyPortsRefetch: () => Promise<any>;
  open: boolean;
  onClose: () => void;
}

export const AddAppProxyPorts = ({
  appId,
  appProxyPortsRefetch,
  open,
  onClose,
}: AddAppProxyPortsProps) => {
  const [addAppProxyPortMutation] = useAddAppProxyPortMutation();

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
        await appProxyPortsRefetch();
        toast.success('Port mapping created successfully');
        onClose();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  if (!open) {
    return null;
  }

  return (
    <Modal>
      <ModalTitle>Add port mapping</ModalTitle>
      <ModalDescription>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Host port:</FormLabel>
            <FormInput
              name="host"
              value={formik.values.host}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.host && formik.touched.host)}
            />
            {formik.errors.host ? (
              <FormHelper status="error">{formik.errors.host}</FormHelper>
            ) : null}
          </div>
          <div>
            <FormLabel>Container port:</FormLabel>
            <FormInput
              name="container"
              value={formik.values.container}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(
                formik.errors.container && formik.touched.container
              )}
            />
            {formik.errors.container ? (
              <FormHelper status="error">{formik.errors.container}</FormHelper>
            ) : null}
          </div>
        </div>
      </ModalDescription>
      <ModalButton
        ctaFn={formik.handleSubmit}
        ctaText={'Create'}
        otherButtonText={'Cancel'}
        isCtaLoading={formik.isSubmitting}
        closeModal={onClose}
      />
    </Modal>
  );
};
