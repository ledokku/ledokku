"use client";

import { useDatabaseContext } from "@/contexts/DatabaseContext";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DatabaseHeaderTabNav = () => {
  const pathname = usePathname();
  const {database} = useDatabaseContext();

  const selectedRoute = pathname.endsWith("/settings")
    ? "settings"
    : pathname.endsWith("/logs")
    ? "logs"
    : "index";

  return (
    <Navbar
      classNames={{
        base: "justify-start overflow-x-auto z-10",
        wrapper: "px-0",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:text-primary",
          "data-[active=true]:font-bold",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:w-full",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarItem isActive={selectedRoute === "index"}>
          <Link href={`/dashboard/databases/${database.id}`}>Base de datos</Link>
        </NavbarItem>
        <NavbarItem isActive={selectedRoute === "logs"}>
          <Link href={`/dashboard/databases/${database.id}/logs`}>
            Registros de ejecución
          </Link>
        </NavbarItem>
        <NavbarItem isActive={selectedRoute === "settings"}>
          <Link href={`/dashboard/databases/${database.id}/settings`}>
            Configuración
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
