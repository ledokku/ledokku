"use client";

import {
  Button,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FiTrash2 } from "react-icons/fi";
import {
  DomainsDocument,
  useDomainsQuery,
  useRemoveDomainMutation,
} from "@/generated/graphql";
import { UrlStatus } from "@/ui/components/misc/UrlStatus";
import { useAppContext } from "@/contexts/AppContext";
import toast from "react-hot-toast";
import { AddAppDomainModal } from "@/ui/components/modals/AddAppDomainModal";

export default function AppDomains() {
  const app = useAppContext();
  const { data, loading } = useDomainsQuery({
    variables: {
      appId: app.id,
    },
  });
  const [removeDomainMutation, { loading: removeDomainMutationLoading }] =
    useRemoveDomainMutation();

  const handleRemoveDomain = async (domain: string) => {
    try {
      await removeDomainMutation({
        variables: {
          input: {
            appId: app.id,
            domainName: domain,
          },
        },
        refetchQueries: [DomainsDocument],
      });
      toast.success("Dominio eliminado");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h3>Configuración de dominios</h3>
          <AddAppDomainModal />
        </div>
        <p>Lista de dominios agregados a &quot;{app.name}&quot;</p>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableColumn width={175}>Status</TableColumn>
            <TableColumn width={175}>SSL</TableColumn>
            <TableColumn>URL</TableColumn>
            <TableColumn width={70}>Acciones</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            emptyContent="No hay dominios agregados a esta aplicación"
            loadingContent={<Spinner />}
          >
            {data?.domains.map((it, index) => (
              <TableRow key={index}>
                <TableCell>
                  <UrlStatus url={`http://${it.domain}`} />
                </TableCell>
                <TableCell>
                  <UrlStatus url={`https://${it.domain}`} />
                </TableCell>
                <TableCell>
                  <Link href={`http://${it.domain}`} isExternal target="_blank">
                    {it.domain}
                  </Link>
                </TableCell>
                <TableCell>
                  {it.domain !== `${app.name}.on.ocstudios.mx` && (
                    <Button
                      color="danger"
                      isIconOnly
                      variant="flat"
                      aria-label="Delete"
                      isLoading={removeDomainMutationLoading}
                      startContent={<FiTrash2 />}
                      disabled={removeDomainMutationLoading}
                      onClick={() => handleRemoveDomain(it.domain)}
                    />
                  )}
                </TableCell>
              </TableRow>
            )) ?? []}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
