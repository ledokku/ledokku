"use client";

import {
  Button,
  Chip,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState } from "react";
import { useDatabaseQuery } from "@/generated/graphql";
import { DatabaseVersionBadge } from "@/ui/components/misc/DatabaseVersionBadge";
import { FiDatabase } from "react-icons/fi";

const Databases = () => {
  const [page, setPage] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const { data, loading, error } = useDatabaseQuery({
    variables: {
      page,
      tags: tags.length > 0 ? tags : undefined,
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between w-full">
        <h2 className="mb-8">Bases de datos</h2>
        <Button
          as={Link}
          href="/dashboard/create/database"
          color="primary"
          startContent={<FiDatabase />}
        >
          Crear base de datos
        </Button>
      </div>
      <div className="flex gap-2 mb-4">
        {tags.map((it, index) => (
          <Chip
            key={index}
            color="primary"
            isCloseable
            onClose={() => {
              setTags(tags.filter((it2) => it2 !== it));
            }}
          >
            {it}
          </Chip>
        ))}
      </div>
      <Table
        bottomContent={
          <div className="flex justify-center">
            <Pagination
              total={data?.databases.totalPages ?? 0}
              page={page + 1}
              onChange={setPage}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn width={300}>Etiquetas</TableColumn>
          <TableColumn>Version</TableColumn>
        </TableHeader>
        <TableBody loadingState={loading ? "loading" : "idle"}>
          {data?.databases.items.map((it, index) => (
            <TableRow key={index}>
              <TableCell>
                <Link href={`/dashboard/databases/${it.id}`}>
                  <h4>{it.name}</h4>
                </Link>
              </TableCell>
              <TableCell>{it.type}</TableCell>
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
              <TableCell>
                <DatabaseVersionBadge database={it} />
              </TableCell>
            </TableRow>
          )) ?? []}
        </TableBody>
      </Table>
    </div>
  );
};

export default Databases;
