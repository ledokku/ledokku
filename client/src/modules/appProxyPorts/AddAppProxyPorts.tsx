import { useFormik } from 'formik';
import * as yup from 'yup';

import { useAddAppProxyPortMutation } from '../../generated/graphql';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  SimpleGrid,
} from '@chakra-ui/react';
import { useToast } from '../../ui/toast';

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
  const toast = useToast();
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
        toast.success("'Port mapping created successfully'");

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
    <Modal isOpen={open} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add port mapping</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
            <FormControl
              id="host"
              isInvalid={Boolean(formik.errors.host && formik.touched.host)}
            >
              <FormLabel>Host port:</FormLabel>
              <Input
                name="host"
                value={formik.values.host}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.host}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="container"
              isInvalid={Boolean(
                formik.errors.container && formik.touched.container
              )}
            >
              <FormLabel>Container port:</FormLabel>
              <Input
                name="container"
                value={formik.values.container}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.container}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            isLoading={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
