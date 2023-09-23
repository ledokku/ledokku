"use client";

import {
  DatabaseByIdQuery,
  DatabaseInfoQuery,
} from "@/generated/graphql.server";
import { serverClient } from "@/lib/apollo.server";
import {
  Button,
  Card,
  Dropdown,
  Link,
  Spinner,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardBody,
} from "@nextui-org/react";
import router, { useRouter } from "next/router";
import { useState } from "react";
import { FiInfo, FiServer } from "react-icons/fi";
import {
  AppsQuery,
  LogPayload,
  useAppsQuery,
  useLinkDatabaseLogsSubscription,
  useLinkDatabaseMutation,
  useUnlinkDatabaseLogsSubscription,
  useUnlinkDatabaseMutation,
} from "@/generated/graphql";
import { DatabaseHeaderInfo } from "@/ui/components/misc/DatabaseHeaderInfo";
import { DatabaseHeaderTabNav } from "@/ui/components/nav/DatabaseHeaderTabNav";
import { useDatabaseContext } from "@/contexts/DatabaseContext";
import toast from "react-hot-toast";
import { Terminal } from "@/ui/components/misc/Terminal";
import { LinkDatabaseToAppForm } from "@/ui/components/forms/LinkDatabaseToAppForm";
import { LinkAppToDatabaseForm } from "@/ui/components/forms/LinkAppToDatabaseForm";
import { AppLinkCard } from "@/ui/components/card/AppLinkCard";

interface DatabasePageProps {
  apps: AppsQuery["apps"]["items"];
}

export const DatabaseInfoPage = ({ apps }: DatabasePageProps) => {
  const { database, info } = useDatabaseContext();

  const linkedApps = database?.apps ?? [];
  const linkedIds = linkedApps.map((db) => db.id);
  const notLinkedApps =
    apps.filter((db) => {
      return linkedIds?.indexOf(db.id) === -1;
    }) ?? [];

  const databaseInfos = info.info
    .map((data) => data.trim())
    .map((info) => {
      const name = info.split(":")[0];
      const value = info.substring(info.indexOf(":") + 1).trim();
      return { name, value };
    });

  return (
    <div className="flex flex-col md:flex-row gap-16">
      <div className="md:w-2/3">
        <div>
          <h3 className="mb-8">Información de la base de datos</h3>
          <Table>
            <TableHeader>
              <TableColumn> </TableColumn>
              <TableColumn>Valor</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>{database.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Identificador</TableCell>
                <TableCell>{database.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>{database.type}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="mt-8 mb-8">Información del contenedor</h3>
          <Table>
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Valor</TableColumn>
            </TableHeader>
            <TableBody>
              {databaseInfos?.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <p>{info.name}</p>
                  </TableCell>
                  <TableCell>{info.value}</TableCell>
                </TableRow>
              )) ?? []}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="md:w-1/3">
        <h3 className="mb-8">Aplicaciones conectadas</h3>
        {apps.length === 0 ? (
          <>
            <p className="mb-4 text-gray-400">
              Actualmente no tienes aplicaciones creadas. Para crear una realiza
              el proceso de creación.
            </p>
            <Button
              as={Link}
              href="/dashboard/create/app"
              color="primary"
              startContent={<FiServer />}
            >
              Crear aplicación
            </Button>
          </>
        ) : (
          <>
            {notLinkedApps.length !== 0 ? (
              <div>
                <LinkAppToDatabaseForm
                  apps={notLinkedApps}
                  database={database}
                />
              </div>
            ) : (
              <>
                <p className="text-gray-400">
                  Todas las aplicaciones ya están enlazadas con esta aplicación.
                  Si quieres crear más aplicaciones inicia el proceso de
                  creación de aplicaciones.
                </p>
                <div className="mt-4">
                  <Button
                    as={Link}
                    href="/dashboard/create/app"
                    color="primary"
                    startContent={<FiServer />}
                  >
                    Crear aplicación
                  </Button>
                </div>
              </>
            )}

            <h3 className="mt-8 mb-4">
              {database.apps.length > 0 && "Aplicaciones enlazadas"}
            </h3>
            <div className="flex flex-col gap-4">
              {database.apps.map((app, index) => {
                return (
                  <AppLinkCard key={index} app={app} database={database} />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
