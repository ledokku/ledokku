import { Button, Grid, Input, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface EnvFormProps {
    name: string;
    value: string;
    isNewVar?: boolean;
    onDelete?: (key: string) => void,
    onSubmit?: (values: { name: string; value: string }) => void
}

export const EnvForm = ({ name, value, isNewVar, onDelete, onSubmit }: EnvFormProps) => {
    const [focus, setFocus] = useState(false);

    const formik = useFormik<{ name: string; value: string }>({
        initialValues: {
            name,
            value,
        },
        validate: (values) => {
            if (values.name.length === 0) return new Error("Necesita un valor");
        },
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
                    </div>
                </Grid>
                <Grid className="flex flex-row">
                    <Button type="submit" className="mr-4">
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