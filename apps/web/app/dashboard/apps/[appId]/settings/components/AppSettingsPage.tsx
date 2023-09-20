"use client";

import { AppByIdQuery } from "@/generated/graphql.server";
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
} from "@nextui-org/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
import {
  DashboardDocument,
  useDestroyAppMutation,
  useSetAppTagsMutation,
} from "@/generated/graphql";
import { BranchChangeInput } from "@/ui/components/BranchChangeInput";
import { TagInput } from "@/ui/components/TagInput";
import { AppRebuild } from "@/ui/components/modals/AppRebuild";
import { AppRestart } from "@/ui/components/modals/AppRestart";
import toast from "react-hot-toast";

interface AppSettingsGeneralProps {
  app: AppByIdQuery["app"];
}

export const AppSettingsPage = ({ app }: AppSettingsGeneralProps) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setAppTags, { loading: loadingSetTags }] = useSetAppTagsMutation();

  const [destroyAppMutation, { loading: destroyAppMutationLoading }] =
    useDestroyAppMutation();

  const DeleteAppNameSchema = yup.object().shape({
    appName: yup
      .string()
      .required("Requerido")
      .test(
        "Equals app name",
        "Debe ser igual al nombre de la aplicación",
        (val) => val === app.name
      ),
  });

  const formik = useFormik<{ appName: string }>({
    initialValues: {
      appName: "",
    },

    validateOnChange: true,
    validationSchema: DeleteAppNameSchema,

    onSubmit: async (values) => {
      try {
        await destroyAppMutation({
          variables: {
            input: { appId: app.id },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        toast.success("Aplicación eliminada");

        router.push("/dashboard");
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  const tags = app?.tags?.map((it) => it.name);

  return (
    <div className="flex flex-col gap-8">
      <TagInput
        tags={tags}
        loading={loadingSetTags}
        onAdd={(tag) =>
          setAppTags({
            variables: {
              input: {
                id: app.id,
                tags: [...(tags ?? []), tag],
              },
            },
          }).then((res) => router.refresh())
        }
        onRemove={(tag) =>
          setAppTags({
            variables: {
              input: {
                id: app.id,
                tags: (tags ?? []).filter((it) => it !== tag),
              },
            },
          }).then((res) => router.refresh())
        }
      />
      {app.appMetaGithub && <BranchChangeInput app={app as any} />}
      <AppRestart app={app as any} />
      <AppRebuild app={app as any} />
      <Card className="mt-8">
        <CardHeader>
          <h3 className="mb-1">Eliminar aplicación</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la
            aplicación &quot;{app.name}&quot; y todo lo relacionado con ella.
          </p>
        </CardBody>
        <CardFooter>
          <Button color="danger" onClick={() => setShowDeleteModal(true)}>
            Eliminar aplicación
          </Button>
        </CardFooter>
      </Card>

      <Modal
        backdrop="blur"
        closeButton
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      >
        <ModalContent>
          <ModalHeader>
            <h4>Eliminar aplicación</h4>
          </ModalHeader>
          <ModalBody>
            Escribre el nombre de la aplicación para eliminar
            <Snippet hideSymbol>{app.name}</Snippet>
            <Input
              autoComplete="off"
              id="appNme"
              name="appName"
              label="Nombre de la aplicación"
              placeholder={app.name}
              value={formik.values.appName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.errors.appName}
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
              disabled={!!formik.errors.appName || formik.values.appName === ""}
              isLoading={destroyAppMutationLoading}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
