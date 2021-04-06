import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { useAddDomainMutation } from '../../generated/graphql';
import { useToast } from '../../ui/toast';

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
        toast.success('Domain added successfully');

        formik.resetForm();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      {!showAddForm ? (
        <Button variant="outline" onClick={() => setShowAddForm(true)}>
          Add custom domain
        </Button>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            id="domainName"
            isInvalid={Boolean(
              formik.errors.domainName && formik.touched.domainName
            )}
          >
            <Input
              placeholder="www.mydomain.com"
              name="domainName"
              value={formik.values.domainName}
              onChange={formik.handleChange}
            />
            <FormErrorMessage>{formik.errors.domainName}</FormErrorMessage>
          </FormControl>

          <ButtonGroup mt="4" spacing="2">
            <Button isLoading={formik.isSubmitting} type="submit">
              Save
            </Button>
            <Button
              variant="outline"
              disabled={formik.isSubmitting}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      )}
    </>
  );
};
