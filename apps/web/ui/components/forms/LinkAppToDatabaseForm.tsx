import { Select, SelectSection, SelectItem, Button } from "@nextui-org/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { FiPlus, FiServer } from "react-icons/fi";
import { labelIcon } from "../misc/DatabaseLabel";
import { DbIcon } from "../../icons/DbIcon";
import { LinkDatabaseModal } from "../modals/LinkDatabaseModal";
import * as yup from "yup";
import { AppTypes, AppsQuery, DatabaseByIdQuery } from "@/generated/graphql";
import { GithubIcon } from "@/ui/icons/GithubIcon";

interface LinkAppToDatabaseFormProps {
  database: DatabaseByIdQuery["database"];
  apps: AppsQuery["apps"]["items"];
}

export const LinkAppToDatabaseForm = ({
  database,
  apps,
}: LinkAppToDatabaseFormProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Formik
        initialValues={{
          app: undefined as string | undefined,
          openDialog: false,
        }}
        validationSchema={yup.object().shape({
          app: yup.string().required("Requerido"),
        })}
        onSubmit={(values, utils) => {
          console.log(values);

          if (values.app === "create-new-app-internal-id")
            return router.push("/dashboard/create/app");

          utils.setFieldValue("openDialog", true);
        }}
      >
        {({ errors, values, resetForm, handleChange, setFieldValue }) => (
          <Form className="w-full">
            <LinkDatabaseModal
              database={database}
              app={apps.find((app) => app.id === values.app)}
              isOpen={values.openDialog}
              onOpenChange={(isOpen) => {
                setFieldValue("openDialog", isOpen);
                if (!isOpen) {
                  resetForm();
                }
              }}
            />
            <Select
              fullWidth
              id="app"
              name="app"
              label="Aplicación"
              placeholder="Selecciona una aplicación"
              errorMessage={errors.app}
              selectedKeys={values.app ? [values.app] : []}
              startContent={
                values.app &&
                (values.app === "create-new-database-internal-id" ? (
                  <span className="text-xl">
                    <FiPlus />
                  </span>
                ) : apps.find((app) => app.id === values.app)?.type ===
                  AppTypes.Github ? (
                  <GithubIcon size={20} />
                ) : (
                  <FiServer />
                ))
              }
              onChange={handleChange}
            >
              <SelectSection>
                <SelectItem
                  key="create-new-app-internal-id"
                  value="create-new-app-internal-id"
                  startContent={
                    <span className="text-xl">
                      <FiPlus />
                    </span>
                  }
                  className="h-12"
                >
                  Crear aplicación nueva
                </SelectItem>
              </SelectSection>
              <SelectSection title="Bases de datos existentes">
                {apps.map((app) => (
                  <SelectItem
                    key={app.id}
                    value={app.id}
                    startContent={
                      app.type === AppTypes.Github ? (
                        <GithubIcon size={20} />
                      ) : (
                        <FiServer />
                      )
                    }
                  >
                    {app.name}
                  </SelectItem>
                ))}
              </SelectSection>
            </Select>
            <Button
              className="mt-4"
              isDisabled={values.app === undefined}
              color="primary"
              type="submit"
            >
              Enlazar aplicación
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
