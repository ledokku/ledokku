import { Select, SelectSection, SelectItem, Button } from "@nextui-org/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { labelIcon } from "../DatabaseLabel";
import { DbIcon } from "../DbIcon";
import { LinkDatabaseModal } from "../modals/LinkDatabaseModal";
import * as yup from "yup";
import { AppByIdQuery, DatabaseQuery } from "@/generated/graphql";

interface LinkDatabaseToAppFormProps {
  app: AppByIdQuery["app"];
  databases: DatabaseQuery["databases"]["items"];
}

export const LinkDatabaseToAppForm = ({
  app,
  databases,
}: LinkDatabaseToAppFormProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Formik
        initialValues={{
          database: undefined as string | undefined,
          openDialog: false,
        }}
        validationSchema={yup.object().shape({
          database: yup.string().required("Requerido"),
        })}
        onSubmit={(values, utils) => {
          console.log(values);

          if (values.database === "create-new-database-internal-id")
            return router.push("/dashboard/create-database");

          utils.setFieldValue("openDialog", true);
        }}
      >
        {({ errors, values, resetForm, handleChange, setFieldValue }) => (
          <Form className="w-full">
            <LinkDatabaseModal
              app={app}
              database={databases.find((db) => db.id === values.database)}
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
              id="database"
              name="database"
              label="Base de datos"
              placeholder="Selecciona una base de datos"
              errorMessage={errors.database}
              selectedKeys={values.database ? [values.database] : []}
              startContent={
                values.database &&
                (values.database === "create-new-database-internal-id" ? (
                  <span className="text-xl">
                    <FiPlus />
                  </span>
                ) : (
                  <DbIcon
                    database={
                      databases.find((db) => db.id === values.database)?.type!
                    }
                    size={20}
                  />
                ))
              }
              onChange={handleChange}
            >
              <SelectSection>
                <SelectItem
                  key="create-new-database-internal-id"
                  value="create-new-database-internal-id"
                  startContent={
                    <span className="text-xl">
                      <FiPlus />
                    </span>
                  }
                  className="h-12"
                >
                  Crear base de datos nueva
                </SelectItem>
              </SelectSection>
              <SelectSection title="Bases de datos existentes">
                {databases.map((database) => (
                  <SelectItem
                    key={database.id}
                    value={database.id}
                    startContent={labelIcon(database.type)}
                  >
                    {database.name}
                  </SelectItem>
                ))}
              </SelectSection>
            </Select>
            <Button
              className="mt-4"
              isDisabled={values.database === undefined}
              color="primary"
              type="submit"
            >
              Enlazar base de datos
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
