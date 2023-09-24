"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  Spacer,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
import {
  DashboardDocument,
  useDestroyDatabaseMutation,
  useSetDatabaseTagsMutation,
} from "@/generated/graphql";
import { TagInput } from "@/ui/components/forms/TagInput";
import toast from "react-hot-toast";
import { useDatabaseContext } from "@/contexts/DatabaseContext";

const Settings = () => {
  const { database } = useDatabaseContext();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [destroyDatabaseMutation, { loading: destroyDbLoading }] =
    useDestroyDatabaseMutation();
  const [setDatabaseTags, { loading: loadingSetTags }] =
    useSetDatabaseTagsMutation();

  const DeleteDatabaseNameSchema = yup.object().shape({
    databaseName: yup
      .string()
      .required("Requerido")
      .test(
        "Equivale al nombre de la base de datos",
        "Debe coincidir con el nombre de la base de datos",
        (val) => val === database?.name
      ),
  });

  const formik = useFormik<{ databaseName: string }>({
    initialValues: {
      databaseName: "",
    },

    validateOnChange: true,
    validationSchema: DeleteDatabaseNameSchema,

    onSubmit: async (values) => {
      try {
        await destroyDatabaseMutation({
          variables: {
            input: { databaseId: database?.id },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        toast.success("Base de datos eliminada");

        router.push("/dashboard");
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  const tags = database?.tags?.map((it) => it.name);

  return (
    <div>
      <div className="grid gap-4 mt-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
        <div className="mb-6 w-3/3">
          <Spacer y={1} />
          <TagInput
            tags={tags}
            loading={loadingSetTags}
            onAdd={(tag) =>
              setDatabaseTags({
                variables: {
                  input: {
                    id: database.id,
                    tags: [...(tags ?? []), tag],
                  },
                },
              }).then((res) => router.refresh())
            }
            onRemove={(tag) =>
              setDatabaseTags({
                variables: {
                  input: {
                    id: database.id,
                    tags: (tags ?? []).filter((it) => it !== tag),
                  },
                },
              }).then((res) => router.refresh())
            }
          />
          <Spacer y={4} />
          <Card>
            <CardHeader>
              <h3 className="mb-1">Eliminar base de datos</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>
                Esta acción no se puede deshacer. Esto eliminará permanentemente
                la base de datos &quot;{database.name}&quot; y todo lo
                relacionado con ella.
              </p>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-end">
              <Button color="danger" onClick={() => setShowDeleteModal(true)}>
                Eliminar base de datos
              </Button>
            </CardFooter>
          </Card>

          <Modal
            backdrop="blur"
            closeButton
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          >
            <ModalContent>
              <ModalHeader>
                <h4>Eliminar base de datos</h4>
              </ModalHeader>
              <ModalBody>
                Escribre el nombre de la base de datos para eliminar
                <Snippet hideSymbol>{database.name}</Snippet>
                <Input
                  autoComplete="off"
                  id="databaseName"
                  name="databaseName"
                  label="Nombre de la base de datos"
                  placeholder={database.name}
                  value={formik.values.databaseName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.errors.databaseName}
                />
              </ModalBody>
              <ModalFooter>
                <Button size="sm" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  color="danger"
                  onClick={() => formik.handleSubmit()}
                  disabled={
                    !formik.values.databaseName || !!formik.errors.databaseName
                  }
                  isLoading={destroyDbLoading}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Settings;
