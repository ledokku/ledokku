"use client";

import {
  useDashboardQuery,
  useGetBuildingAppsQuery,
} from "@/generated/graphql";
import { BuildingAlert } from "@/ui/components/alerts/BuildingAlert";
import { AppCard } from "@/ui/components/card/AppCard";
import { DatabaseCard } from "@/ui/components/card/DatabaseCard";
import { ActivityFeed } from "@/ui/components/list/ActivityFeed";
import { Button, Spacer, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { FiDatabase, FiPhone, FiServer } from "react-icons/fi";

export default function Dashboard() {
  const { data: buildingApps } = useGetBuildingAppsQuery({
    fetchPolicy: "network-only",
    pollInterval: 1000,
  });

  const { data, loading } = useDashboardQuery({
    ssr: true,
  });

  return (
    <>
      <div className="flex flex-col gap-2">
        {buildingApps &&
          buildingApps.buildingApps.map((it, index) => (
            <BuildingAlert key={index} app={it as any} />
          ))}
        {buildingApps && buildingApps.buildingApps.length > 0 && <Spacer />}
      </div>
      <div className="w-full flex flex-col md:flex-row justify-end mb-4 items-end">
        <Button
          variant="flat"
          color="primary"
          className="mr-0 md:mr-4 mb-4 md:mb-0"
          as={Link}
          href="/dashboard/create/database"
          startContent={<FiDatabase />}
        >
          Crear base de datos
        </Button>
        <Button
          as={Link}
          color="primary"
          href="/dashboard/create/app"
          startContent={<FiServer />}
        >
          Crear aplicación
        </Button>
      </div>
      <div className="flex flex-col xl:flex-row gap-16 w-full">
        <div className="xl:w-2/3">
          <div>
            <h2 className="mb-4">Aplicaciones</h2>
            {loading && <Spinner />}
            {data?.apps.items.length === 0 && (
              <div className="text-gray-400 text-xl">Sin aplicaciones</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {data?.apps.items
                .slice(0, 4)
                .map((app, index) => <AppCard app={app as any} key={index} />)}
            </div>
          </div>
          <div>
            <h2 className="mt-8 mb-4">Bases de datos</h2>
            {loading && <Spinner />}
            {data?.databases.items.length === 0 && (
              <div className="text-gray-400 text-xl">Sin bases de datos</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {data?.databases.items
                .slice(0, 4)
                .map((database, index) => (
                  <DatabaseCard database={database as any} key={index} />
                ))}
            </div>
          </div>
        </div>
        <div className="xl:w-1/3">
          <div className="flex justify-between">
            <h2 className="mb-4">Última actividad</h2>
            <Button variant="ghost" as={Link} href="/activity">
              Ver más...
            </Button>
          </div>
          <ActivityFeed isSinglePage={true} />
        </div>
      </div>
    </>
  );
}
