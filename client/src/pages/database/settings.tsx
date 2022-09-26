import * as yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  useDatabaseByIdQuery,
  useDestroyDatabaseMutation,
  DashboardDocument,
} from '../../generated/graphql';
import { Header } from '../../ui';
import { useToast } from '../../ui/toast';
import { DatabaseHeaderInfo } from '../../modules/database/DatabaseHeaderInfo';
import { DatabaseHeaderTabNav } from '../../modules/database/DatabaseHeaderTabNav';
import { Button, Card, Container, Input, Loading, Modal, Spacer, Text } from '@nextui-org/react';
import { useState } from 'react';

export const Settings = () => {
  const { id: databaseId } = useParams<{ id: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  let history = useHistory();
  const toast = useToast();
  const [
    destroyDatabaseMutation,
    { loading: destroyDbLoading },
  ] = useDestroyDatabaseMutation();
  const { data, loading /* error */ } = useDatabaseByIdQuery({
    variables: {
      databaseId,
    },
    ssr: false,
    skip: !databaseId,
  });



  const DeleteDatabaseNameSchema = yup.object().shape({
    databaseName: yup
      .string()
      .required('Requerido')
      .test(
        'Equivale al nombre de la base de datos',
        'Debe coincidir con el nombre de la base de datos',
        (val) => val === data?.database?.name
      ),
  });

  const formik = useFormik<{ databaseName: string }>({
    initialValues: {
      databaseName: '',
    },

    validateOnChange: true,
    validationSchema: DeleteDatabaseNameSchema,

    onSubmit: async (values) => {
      try {
        await destroyDatabaseMutation({
          variables: {
            input: { databaseId },
          },
          refetchQueries: [
            {
              query: DashboardDocument,
            },
          ],
        });
        toast.success('Database deleted successfully');

        history.push('/dashboard');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
  });

  if (!data) {
    return null;
  }

  // // TODO display error

  if (loading) {
    // TODO nice loading
    return <Loading />;
  }

  const { database } = data;

  if (!database) {
    // TODO nice 404
    return <p>Database not found.</p>;
  }



  return (
    <div>
      <div>
        <Header />
        <DatabaseHeaderInfo database={database} />
        <DatabaseHeaderTabNav database={database} />
      </div>

      <Container>
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 mt-10">
          <div className="w-3/3 mb-6">
            <Text h2>Configuración</Text>
            <Spacer y={3} />
            <Card className='mt-8' variant='bordered' borderWeight='normal'>
              <Card.Header>
                <Text h3 className='mb-1'>
                  Eliminar base de datos
                </Text>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <Text>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente la base de datos "{database.name}" y todo lo relacionado con ella.
                </Text>
              </Card.Body>
              <Card.Footer>
                <Button color="error" onClick={() => setShowDeleteModal(true)}>
                  Eliminar base de datos
                </Button>
              </Card.Footer>
            </Card>

            <Modal blur closeButton open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
              <Modal.Header>
                <Text h4>Eliminar base de datos</Text>
              </Modal.Header>
              <Modal.Body>
                <Input
                  css={{ marginBottom: 0 }}
                  autoComplete="off"
                  id="databaseName"
                  name="databaseName"
                  label="Nombre de la base de datos"
                  placeholder={database.name}
                  value={formik.values.databaseName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Text color='$error'>{formik.errors.databaseName}</Text>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  size="sm"
                  bordered
                  onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                <Button
                  size="sm"
                  type="submit"
                  color="error"
                  onClick={() => formik.handleSubmit()}
                  disabled={!formik.values.databaseName || !!formik.errors.databaseName}
                >
                  {destroyDbLoading ? <Loading size='sm' color="currentColor" /> : "Eliminar"}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </Container>
    </div>
  );
};
