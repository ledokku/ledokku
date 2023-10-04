"use client";

import { ApolloError } from "@apollo/client";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  ModalContent,
  ModalBody,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
  AllowedUsersDocument,
  useAddAllowedUserMutation,
  useAllowedUsersQuery,
  usePluginsQuery,
  useRemoveAllowedUserMutation,
} from "@/generated/graphql";
import toast from "react-hot-toast";

const Settings = () => {
  const { data, loading } = useAllowedUsersQuery();
  const [addAllowedUser, { loading: loadingAddUser }] =
    useAddAllowedUserMutation({
      awaitRefetchQueries: true,
      refetchQueries: [AllowedUsersDocument],
    });
  const [removeAllowedUser, { loading: loadingRemoveUser }] =
    useRemoveAllowedUserMutation({
      awaitRefetchQueries: true,
      refetchQueries: [AllowedUsersDocument],
    });
  const [showAddUser, setShowAddUser] = useState(false);
  const [email, setEmail] = useState("");
  const { data: plugins, loading: loadingPlugins } = usePluginsQuery();
  const [pluginPage, setPluginPage] = useState(1);

  return (
    <div>
      <h2 className="mb-8">Configuración</h2>
      <div>
        <div className="flex flex-row justify-between">
          <h3 className="mb-8">Usuarios autorizados</h3>
          <Button
            onClick={() => {
              setShowAddUser(true);
            }}
            isLoading={loadingAddUser}
          >
            Agregar usuario
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableColumn>Usuario</TableColumn>
            <TableColumn>Correo electrónico</TableColumn>
            <TableColumn width={50}> </TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            emptyContent="No hay usuarios autorizados"
            loadingContent={<Spinner />}
          >
            {data?.settings.allowedEmails.map((it, index) => {
              const user = data.settings.allowedUsers.find(
                (it2) => it2.email === it
              );

              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar size="sm" src={user?.avatarUrl} />
                      {user?.username ?? "No registrado"}
                    </div>
                  </TableCell>
                  <TableCell>{it}</TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      isLoading={loadingRemoveUser}
                      onClick={() => {
                        removeAllowedUser({
                          variables: {
                            email: it,
                          },
                        }).catch((it: ApolloError) => {
                          toast.error(it.message);
                        });
                      }}
                      color="danger"
                    >
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) ?? []}
          </TableBody>
        </Table>
        <h3 className="mt-16 mb-8">Plugins instalados</h3>
        <Table
          bottomContent={
            <div className="flex justify-center">
              <Pagination
                page={pluginPage}
                total={
                  plugins?.plugins ? Math.ceil(plugins.plugins.length / 10) : 0
                }
                onChange={setPluginPage}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn width={150}>Versión</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loadingPlugins}
            emptyContent="No hay plugins instalados"
            loadingContent={<Spinner />}
          >
            {plugins?.plugins
              ?.slice(10 * (pluginPage - 1), 10 * (pluginPage - 1) + 10)
              ?.map((it) => (
                <TableRow key={it.name}>
                  <TableCell>{it.name}</TableCell>
                  <TableCell>{it.version}</TableCell>
                </TableRow>
              )) ?? []}
          </TableBody>
        </Table>
      </div>
      <Modal
        closeButton
        isOpen={showAddUser}
        backdrop="blur"
        onClose={() => setShowAddUser(false)}
      >
        <ModalContent>
          <ModalBody>
            <form
              className="flex flex-col items-end gap-4"
              onSubmit={(e) => {
                addAllowedUser({
                  variables: {
                    email: email,
                  },
                }).then((it) => {
                  setShowAddUser(false);
                  setEmail("");
                });
                e.preventDefault();
              }}
            >
              <Input
                fullWidth
                label="Correo electrónico"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                type="email"
              />
              <Button size="sm" type="submit">
                Agregar
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Settings;
