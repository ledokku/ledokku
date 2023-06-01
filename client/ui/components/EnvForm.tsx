import { Button, Checkbox, Input, Text, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import * as yup from 'yup';

interface EnvFormProps {
    name: string;
    value: string;
    asBuildArg: boolean;
    isNewVar?: boolean;
    onDelete?: (key: string) => void,
    onSubmit?: (values: { name: string; value: string, asBuildArg: boolean }) => void
}

export const EnvForm = ({ name, value, isNewVar, onDelete, onSubmit, asBuildArg }: EnvFormProps) => {
    const [focus, setFocus] = useState(false);

    const envSchema = yup.object().shape<{ name: any; value: any, asBuildArg: any }>({
        name: yup.string().required("El nombre es requerido"),
        value: yup.string().when("asBuildArg", {
            is: true,
            then: yup.string().matches(/^[^ ]*$/gm, "Los build-args no deben tener espacios")
        }),
        asBuildArg: yup.boolean()
    });

    const formik = useFormik<{ name: string; value: string, asBuildArg: boolean }>({
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
            <div className='flex flex-col md:flex-row gap-4'>
                <div className='w-full'>
                    <Input
                        width="100%"
                        autoComplete="off"
                        id={isNewVar ? 'newVarName' : name}
                        status={formik.errors.name ? 'error' : undefined}
                        name="name"
                        placeholder="Nombre"
                        aria-autocomplete="none"
                        key={name}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className='w-full'>
                    {formik.values.value.length > 40 ? <Textarea
                        width="100%"
                        size='md'
                        autoComplete="off"
                        id={isNewVar ? 'newVarValue' : value}
                        name="value"
                        placeholder="Valor"
                        status={Object.values(formik.errors).some(it => !!it) ? 'error' : undefined}
                        key={value}
                        onFocus={(e) => {
                            setFocus(document.activeElement === e.currentTarget)
                        }}
                        onBlur={(e) => {
                            setFocus(document.activeElement === e.currentTarget)
                        }}
                        style={{ filter: focus || isNewVar ? "" : 'blur(4px)' }}
                        value={formik.values.value}
                        onChange={formik.handleChange}
                    /> : <Input
                        width="100%"
                        size='md'
                        autoComplete="off"
                        id={isNewVar ? 'newVarValue' : value}
                        name="value"
                        placeholder="Valor"
                        status={Object.values(formik.errors).some(it => !!it) ? 'error' : undefined}
                        key={value}
                        onFocus={(e) => {
                            setFocus(document.activeElement === e.currentTarget)
                        }}
                        onBlur={(e) => {
                            setFocus(document.activeElement === e.currentTarget)
                        }}
                        style={{ filter: focus || isNewVar ? "" : 'blur(4px)' }}
                        value={formik.values.value}
                        onChange={formik.handleChange}
                    />
                    }
                    <Text color="$error">{Object.values(formik.errors).find(it => !!it)}</Text>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <Checkbox
                        label='Como build-arg'
                        name='asBuildArg'
                        size='sm'
                        isSelected={formik.values.asBuildArg}
                        onChange={(val) => formik.setFieldValue("asBuildArg", val)} />
                    <div className='flex gap-4 w-48 justify-end'>
                        <Button
                            type="submit"
                            auto
                            size="sm"
                            disabled={value === formik.values.value
                                && name === formik.values.name
                                && asBuildArg === formik.values.asBuildArg
                                && !isNewVar}>
                            {isNewVar ? (
                                'Agregar'
                            ) : (
                                'Guardar'
                            )}
                        </Button>
                        {!isNewVar && (
                            <Button
                                auto
                                css={{ minWidth: 'unset' }}
                                size="sm"
                                color="error"
                                aria-label="Delete"
                                disabled={!onDelete}
                                icon={
                                    <FiTrash2 />
                                }
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