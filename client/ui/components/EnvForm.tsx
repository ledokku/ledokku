import { Button, Checkbox, Grid, Input, Text, Textarea } from '@nextui-org/react';
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
        name: yup.string().required(),
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
        <form onSubmit={formik.handleSubmit} autoComplete="off">
            <Grid.Container gap={1} direction="column">
                <Grid>
                    <Input
                        width="100%"
                        autoComplete="off"
                        id={isNewVar ? 'newVarName' : name}
                        name="name"
                        placeholder="Nombre"
                        label="Nombre"
                        key={name}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid>
                    <div>
                        <Textarea
                            width="100%"
                            autoComplete="off"
                            id={isNewVar ? 'newVarValue' : value}
                            name="value"
                            placeholder="Valor"
                            label="Valor"
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
                        <Text color="$error">{Object.values(formik.errors).find(it => !!it)}</Text>
                    </div>
                </Grid>
                <Checkbox
                    label='Como build-arg'
                    name='asBuildArg'
                    size='md'
                    isSelected={formik.values.asBuildArg}
                    onChange={(val) => formik.setFieldValue("asBuildArg", val)} />
                <Grid className="flex flex-row">
                    <Button
                        type="submit"
                        disabled={value === formik.values.value
                            && name === formik.values.name
                            && asBuildArg === formik.values.asBuildArg}
                        className="mr-4">
                        {isNewVar ? (
                            'Agregar'
                        ) : (
                            'Guardar'
                        )}
                    </Button>
                    {!isNewVar && (
                        <Button
                            css={{ minWidth: '0px' }}
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

                </Grid>
            </Grid.Container>
        </form>
    );
};