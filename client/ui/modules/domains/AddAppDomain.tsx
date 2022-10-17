import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAddDomainMutation } from '../../../generated/graphql';
import { useToast } from '../../toast';
import { Button, Input, Loading, Modal, Text } from '@nextui-org/react';

const addAppDomainYupSchema = yup.object().shape({
  domainName: yup.string().required('Domain name is required'),
});

interface AddDomainProps {
  appId: string;
  appDomainsRefetch: () => Promise<any>;
}

export const AddAppDomain = ({ appId, appDomainsRefetch }: AddDomainProps) => {
  const toast = useToast();
  const [addDomainMutation] = useAddDomainMutation();
  const [showAddForm, setShowAddForm] = useState(false);

  const formik = useFormik<{ domainName: string }>({
    initialValues: {
      domainName: '',
    },
    validateOnChange: true,
    validationSchema: addAppDomainYupSchema,
    onSubmit: async (values) => {
      try {
        await addDomainMutation({
          variables: {
            input: {
              appId,
              domainName: values.domainName,
            },
          },
        });

        await appDomainsRefetch();
        toast.success('Dominio agregado');
        setShowAddForm(false)

        formik.resetForm();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className='w-full flex flex-row justify-end'>
      <Button bordered onClick={() => setShowAddForm(true)}>
        Añadir dominio personalizado
      </Button>
      <Modal closeButton blur open={showAddForm} onClose={() => setShowAddForm(false)}>
        <Modal.Header>
          <Text h4>
            Agegar dominio personalizado
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            label='Dominio personalizado'
            placeholder="www.example.com"
            name="domainName"
            value={formik.values.domainName}
            onChange={formik.handleChange}
          />
          <Text color='$error'>{formik.errors.domainName}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            bordered
            color="error"
            disabled={formik.isSubmitting}
            onClick={() => setShowAddForm(false)}
          >
            Cancelar
          </Button>
          <Button
            disabled={formik.values.domainName === ""}
            onClick={() => formik.handleSubmit()} size="sm">
            {formik.isSubmitting ? <Loading color="currentColor" size='sm' /> : "Guardar"}
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
};
