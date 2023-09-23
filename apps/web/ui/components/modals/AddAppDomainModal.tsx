import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { DomainsDocument, useAddDomainMutation } from "@/generated/graphql";
import { useAppContext } from "@/contexts/AppContext";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

const addAppDomainYupSchema = yup.object().shape({
  domainName: yup.string().required("Domain name is required"),
});

export const AddAppDomainModal = () => {
  const app = useAppContext();
  const [addDomainMutation] = useAddDomainMutation();
  const [showAddForm, setShowAddForm] = useState(false);

  const formik = useFormik<{ domainName: string }>({
    initialValues: {
      domainName: "",
    },
    validateOnChange: true,
    validationSchema: addAppDomainYupSchema,
    onSubmit: async (values) => {
      try {
        await addDomainMutation({
          variables: {
            input: {
              appId: app.id,
              domainName: values.domainName,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [DomainsDocument],
        });
        toast.success("Dominio agregado");
        setShowAddForm(false);

        formik.resetForm();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <Button
        color="primary"
        size="sm"
        startContent={<FiPlus />}
        onClick={() => setShowAddForm(true)}
      >
        Añadir dominio personalizado
      </Button>
      <Modal
        closeButton
        backdrop="blur"
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
      >
        <ModalContent>
          <ModalHeader>
            <h4>Agegar dominio personalizado</h4>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Dominio personalizado"
              placeholder="www.example.com"
              name="domainName"
              value={formik.values.domainName}
              onChange={formik.handleChange}
              errorMessage={formik.errors.domainName}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              disabled={formik.isSubmitting}
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={formik.values.domainName === ""}
              onClick={() => formik.handleSubmit()}
              color="primary"
              size="sm"
              isLoading={formik.isSubmitting}
            >
              Añadir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
