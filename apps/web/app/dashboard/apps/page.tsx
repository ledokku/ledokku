"use client";

import {
  Badge,
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
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useAppsQuery } from "@/generated/graphql";

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
              <Badge
                key={index}
                onClick={() => {
                  if (!tags.includes(it.name)) {
                    setTags([...tags, it.name]);
                  }
                }}
                className="cursor-pointer"
                disableOutline
                color="primary"
              >
                {it.name}
              </Badge>
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
        <Button href="dashboard/app-creation/create-app" color="primary">
          Crear aplicación
        </Button>
      </div>
      <div className="flex gap-2">
        {tags.map((it, index) => (
          <Badge key={index} disableOutline color="primary">
            {it}
            <AiOutlineCloseCircle
              className="ml-1 cursor-pointer"
              onClick={() => {
                setTags(tags.filter((it2) => it2 !== it));
              }}
            />
          </Badge>
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
          loadingState={loading ? "loading" : "idle"}
        >
          {rows}
        </TableBody>
      </Table>
    </>
  );
};

export default Apps;
