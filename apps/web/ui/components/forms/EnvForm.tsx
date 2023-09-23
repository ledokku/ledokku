import { Button, Checkbox, Input, Textarea } from "@nextui-org/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import * as yup from "yup";

interface EnvFormProps {
  name: string;
  value: string;
  asBuildArg: boolean;
  isNewVar?: boolean;
  onDelete?: (key: string) => void;
  onSubmit?: (values: {
    name: string;
    value: string;
    asBuildArg: boolean;
  }) => void;
}

export const EnvForm = ({
  name,
  value,
  isNewVar,
  onDelete,
  onSubmit,
  asBuildArg,
}: EnvFormProps) => {
  const [focus, setFocus] = useState(false);

  const envSchema = yup
    .object()
    .shape<{ name: any; value: any; asBuildArg: any }>({
      name: yup.string().required("El nombre es requerido"),
      value: yup.string().when("asBuildArg", {
        is: true,
        then: (schema) =>
          schema.matches(/^[^ ]*$/gm, "Los build-args no deben tener espacios"),
      }),
      asBuildArg: yup.boolean(),
    });

  const formik = useFormik<{
    name: string;
    value: string;
    asBuildArg: boolean;
  }>({
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name,
      value,
      asBuildArg,
    },
    validationSchema: envSchema,
    onSubmit: (values) => {
      if (!values.name || !values.value) return;
      onSubmit?.call(this, values);
      if (isNewVar) {
        formik.resetForm();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="md:w-1/3 w-full">
          <Input
            autoComplete="off"
            id={isNewVar ? "newVarName" : name}
            errorMessage={formik.errors.name}
            name="name"
            placeholder="Nombre"
            aria-autocomplete="none"
            key={name}
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <div className="md:w-2/3 w-full">
          <Textarea
            classNames={{
              label: "p-0",
            }}
            size="md"
            maxRows={formik.values.value.length > 50 ? 5 : 1}
            autoComplete="off"
            id={isNewVar ? "newVarValue" : value}
            name="value"
            placeholder="Valor"
            errorMessage={formik.errors.value}
            key={value}
            onFocus={(e) => {
              setFocus(document.activeElement === e.currentTarget);
            }}
            onBlur={(e) => {
              setFocus(document.activeElement === e.currentTarget);
            }}
            style={{ filter: focus || isNewVar ? "" : "blur(4px)" }}
            value={formik.values.value}
            onChange={formik.handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex items-center gap-2">
            Build Arg
            <Checkbox
              name="asBuildArg"
              size="sm"
              isSelected={formik.values.asBuildArg}
              onChange={(val) =>
                formik.setFieldValue("asBuildArg", val.target.checked)
              }
            />
          </div>
          <div className="flex gap-4 w-48 md:justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={
                value === formik.values.value &&
                name === formik.values.name &&
                asBuildArg === formik.values.asBuildArg &&
                !isNewVar
              }
              color="primary"
            >
              {isNewVar ? "Agregar" : "Guardar"}
            </Button>
            {!isNewVar && (
              <Button
                size="sm"
                color="danger"
                aria-label="Delete"
                disabled={!onDelete}
                isIconOnly
                startContent={<FiTrash2 />}
                onClick={() => {
                  onDelete?.call(this, name);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
