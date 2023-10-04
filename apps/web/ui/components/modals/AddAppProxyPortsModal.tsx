import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAddAppProxyPortMutation } from "../../../generated/graphql";
import toast from "react-hot-toast";
import { AppProxyPortsDocument } from "@/generated/graphql.server";

const createAppProxyPortSchema = yup.object().shape({
  host: yup.string().required("El puerto del anfitrion es requerido"),
  container: yup.string().required("El puerto del contenedor es requerido"),
});

interface AddAppProxyPortsModalProps {
  appId: string;
  open: boolean;
  onClose: () => void;
}

export const AddAppProxyPortsModal = ({
  appId,
  open,
  onClose,
}: AddAppProxyPortsModalProps) => {
  const [addAppProxyPortMutation] = useAddAppProxyPortMutation();
  const formik = useFormik<{ host: string; container: string }>({
    initialValues: {
      host: "",
      container: "",
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
          awaitRefetchQueries: true,
          refetchQueries: [AppProxyPortsDocument],
        });
        toast.success("Mapeo de puertos creado");

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
    <Modal isOpen={open} onClose={onClose} backdrop="blur" closeButton>
      <ModalContent>
        <ModalHeader>
          <h4>Agregar mapeo de puertos</h4>
        </ModalHeader>
        <ModalBody>
          <Input
            name="host"
            label="Puerto del anfitrion (host)"
            value={formik.values.host}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.host}
          />
          <Input
            name="container"
            label="Puerto del contenedor"
            value={formik.values.container}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.container}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} size="sm">
            Cancelar
          </Button>
          <Button
            size="sm"
            color="primary"
            disabled={!!formik.errors.host || !!formik.errors.container}
            onClick={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
