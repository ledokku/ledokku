"use client";

import {
  Button,
  Link,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useAppsQuery } from "@/generated/graphql";
import { FiServer } from "react-icons/fi";

const Apps = () => {
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const { data, loading, previousData } = useAppsQuery({
    variables: {
      page: page - 1,
      tags: tags.length > 0 ? tags : undefined,
    },
  });

  const optimisticData = data ?? previousData;

  const pages = useMemo(() => {
    return optimisticData?.apps.totalPages ?? 0;
  }, [optimisticData]);

  const rawRows =
    data?.apps.items?.map((it) => (
      <TableRow key={it.id}>
        <TableCell>
          <Link href={`/dashboard/apps/${it.id}`}>
            <h5 className="mb-0">{it.name}</h5>
          </Link>
        </TableCell>
        <TableCell>
          {it.appMetaGithub
            ? `${it.appMetaGithub.repoOwner}/${it.appMetaGithub.repoName}`
            : " "}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            {it.tags.map((it, index) => (
              <Chip
                key={index}
                onClick={() => {
                  if (!tags.includes(it.name)) {
                    setTags([...tags, it.name]);
                  }
                }}
                className="cursor-pointer"
                color="primary"
              >
                {it.name}
              </Chip>
            ))}
          </div>
        </TableCell>
        <TableCell>{it.status}</TableCell>
      </TableRow>
    )) ?? [];

  const rows = [
    ...rawRows,
    <TableRow key="last" className="h-full">
      <TableCell> </TableCell>
      <TableCell> </TableCell>
      <TableCell> </TableCell>
      <TableCell> </TableCell>
    </TableRow>,
  ];

  return (
    <>
      <div className="flex flex-row justify-between w-full mb-4">
        <h2>Aplicaciones</h2>
        <Button
          href="/dashboard/create/app"
          color="primary"
          startContent={<FiServer />}
        >
          Crear aplicación
        </Button>
      </div>
      <div className="flex gap-2 mb-4">
        {tags.map((it, index) => (
          <Chip
            isCloseable
            onClose={() => {
              setPage(1);
              setTags(tags.filter((it2) => it2 !== it));
            }}
            key={index}
            color="primary"
          >
            {it}
          </Chip>
        ))}
      </div>
      <Table
        classNames={{
          table: "min-h-[400px]",
        }}
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Repositorio</TableColumn>
          <TableColumn width={300}>Etiquetas</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody
          loadingContent={<Spinner />}
          isLoading={loading}
          emptyContent="No hay aplicaciones"
        >
          {rows}
        </TableBody>
      </Table>
    </>
  );
};

export default Apps;
