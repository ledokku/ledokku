import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAddDomainMutation } from '../../generated/graphql';
import { FormHelper, FormInput, Button } from '../../ui';
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
      <p className="text-gray-400 text-sm mb-2 mt-4">
        To add new domain to the app, fill in the form below
      </p>
      <div className="grid md:grid-cols-3 gap-2">
        <FormInput
          className="col-span-2"
          name="domainName"
          value={formik.values.domainName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.domainName && formik.touched.domainName)}
        />
        <Button
          disabled={!!formik.errors.domainName || !formik.values.domainName}
          color="grey"
          isLoading={formik.isSubmitting}
          onClick={() => formik.handleSubmit()}
        >
          Add
        </Button>
        {formik.errors.domainName ? (
          <FormHelper status="error">{formik.errors.domainName}</FormHelper>
        ) : null}
      </div>
    </>
  );
};
