"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AppHeaderTabNav = () => {
  const pathname = usePathname();
  const app = useAppContext();

  const selectedRoute = pathname.endsWith("/logs")
    ? "logs"
    : pathname.endsWith("/env")
    ? "env"
    : pathname.endsWith("/activity") || pathname.endsWith("/build")
    ? "activity"
    : pathname.endsWith("/settings/ports") ||
      pathname.endsWith("/settings/domains") ||
      pathname.endsWith("/settings")
    ? "settings"
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
          <Link href={`/dashboard/apps/${app.id}`}>Aplicación</Link>
        </NavbarItem>
        <NavbarItem isActive={selectedRoute === "logs"}>
          <Link href={`/dashboard/apps/${app.id}/logs`}>
            Registros de ejecución
          </Link>
        </NavbarItem>
        <NavbarItem isActive={selectedRoute === "activity"}>
          <Link href={`/dashboard/apps/${app.id}/activity`}>Actividad</Link>
        </NavbarItem>
        <NavbarItem isActive={selectedRoute === "env"}>
          <Link href={`/dashboard/apps/${app.id}/env`}>
            Variables de entorno
          </Link>
        </NavbarItem>
        <NavbarItem isActive={selectedRoute === "settings"}>
          <Link href={`/dashboard/apps/${app.id}/settings`}>Configuración</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
