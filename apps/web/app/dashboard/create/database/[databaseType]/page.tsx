"use client";

import { useDatabaseListContext } from "@/contexts/DatabaseListContext";
import {
  DbTypes,
  useCreateDatabaseMutation,
  useIsPluginInstalledQuery,
} from "@/generated/graphql";
import { Alert } from "@/ui/components/alerts/Alert";
import { TagInput } from "@/ui/components/forms/TagInput";
import { LoadingSection } from "@/ui/components/misc/LoadingSection";
import { DbIcon } from "@/ui/icons/DbIcon";
import { dbTypeToDokkuPlugin, dbTypeToReadableName } from "@/utils/utils";
import { Button, Input, Snippet } from "@nextui-org/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as yup from "yup";

function typeToDockerHub(type: DbTypes): string | undefined {
  switch (type) {
    case DbTypes.Postgresql:
      return "postgres";
    case DbTypes.Mongodb:
      return "mongo";
    case DbTypes.Mysql:
      return "mysql";
    case DbTypes.Redis:
      return "redis";
    case DbTypes.Mariadb:
      return "mariadb";
  }

  return undefined;
}

function lowerCaseToDbType(type: string | undefined): DbTypes | undefined {
  return Object.values(DbTypes).find(
    (dbType) => dbType.toLowerCase() === type?.toLowerCase()
  );
}

enum DbCreationStatus {
  FAILURE = "Failure",
  SUCCESS = "Success",
}

export default function CreateDatabasePage({ params }: any) {
  const type = lowerCaseToDbType(params.databaseType);
  const databases = useDatabaseListContext();
  const router = useRouter();
  const [createDatabaseMutation, { loading }] = useCreateDatabaseMutation({
    onCompleted: (data) => {
      router.push(`/dashboard/databases/${data.createDatabase.id}/build`);
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { data: isPluginInstalled, loading: isPluginInstalledLoading } =
    useIsPluginInstalledQuery({
      pollInterval: 1000,
      variables: {
        pluginName: dbTypeToDokkuPlugin(type!),
      },
    });

  if (!type) {
    return <h3>Invalid database type</h3>;
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <DbIcon database={type} size={48} />
        <h2>Crear una base de datos {dbTypeToReadableName(type)}</h2>
      </div>
      {isPluginInstalledLoading && <LoadingSection />}
      {!isPluginInstalledLoading &&
        isPluginInstalled?.isPluginInstalled.isPluginInstalled === false && (
          <Alert
            className="mt-8"
            type="warning"
            message="El plugin de Dokku no está instalado. Por favor, instale el plugin de Dokku con el siguiente comando para poder crear una base de datos."
            title="Plugin de Dokku no instalado"
          >
            <Snippet>
              {`sudo dokku plugin:install https://github.com/dokku/dokku-${dbTypeToDokkuPlugin(
                type
              )}.git ${dbTypeToDokkuPlugin(type)}`}
            </Snippet>
          </Alert>
        )}

      {!isPluginInstalledLoading &&
        isPluginInstalled?.isPluginInstalled.isPluginInstalled === true && (
          <Formik
            validateOnMount
            initialValues={{
              name: "",
              tags: [] as string[],
              type,
              version: "",
              image: "",
            }}
            validationSchema={yup.object({
              name: yup
                .string()
                .required("El nombre es requerido")
                .matches(
                  /^[a-z0-9-]+$/,
                  "Solo se permiten letras, numeros y guiones"
                )
                .notOneOf(
                  databases.map((it) => it.name),
                  "Ya existe una base de datos con este nombre"
                ),
              image: yup.string(),
              version: yup
                .string()
                .matches(
                  /^([a-zA-Z0-9-]+\.?)+$/,
                  `Debe cumplir el patron ${/([a-zA-Z0-9-]+\.?)+/}`
                ),
              tags: yup.array().of(yup.string()),
              type: yup.string().oneOf(Object.values(DbTypes)),
            })}
            onSubmit={(values) => {
              createDatabaseMutation({
                variables: {
                  input: {
                    ...values,
                    image: values.image.length > 0 ? values.image : undefined,
                    version:
                      values.version.length > 0 ? values.version : undefined,
                  },
                },
              });
            }}
          >
            {({ values, errors, handleChange, handleSubmit, isValid }) => (
              <Form className="mt-8 gap-4 flex flex-col">
                <Input
                  label="Nombre"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  errorMessage={errors.name}
                />
                <Input
                  label="Imagen"
                  id="image"
                  name="image"
                  placeholder={`Ej. ${typeToDockerHub(type)}`}
                  value={values.image}
                  onChange={handleChange}
                  errorMessage={errors.image}
                />
                <Input
                  label="Versión"
                  id="version"
                  name="version"
                  placeholder="Ej. v13.3.0"
                  value={values.version}
                  onChange={handleChange}
                  errorMessage={errors.version}
                />
                <TagInput
                  tags={values.tags}
                  onAdd={(tag) => {
                    if (values.tags.includes(tag)) {
                      return;
                    }

                    handleChange({
                      target: {
                        name: "tags",
                        value: [...values.tags, tag],
                      },
                    });
                  }}
                  onRemove={(tag) => {
                    handleChange({
                      target: {
                        name: "tags",
                        value: values.tags.filter((t) => t !== tag),
                      },
                    });
                  }}
                />
                <Button
                  onClick={() => handleSubmit()}
                  isLoading={loading}
                  isDisabled={!isValid}
                  color="primary"
                  className="self-start"
                >
                  Crear base de datos
                </Button>
              </Form>
            )}
          </Formik>
        )}
    </div>
  );
}
