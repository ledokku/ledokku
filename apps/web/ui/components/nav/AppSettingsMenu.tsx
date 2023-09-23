"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AppSettingsMenu = () => {
  const app = useAppContext();
  const pathname = usePathname();

  const selectedRoute = pathname.endsWith("/settings/ports")
    ? "ports"
    : pathname.endsWith("/settings/domains")
    ? "domains"
    : pathname.endsWith("/settings")
    ? "general"
    : "general";

  return (
    <Navbar
      classNames={{
        content: "md:flex-col",
        base: "justify-start overflow-x-auto md:overflow-hidden z-10 h-auto",
        wrapper: "px-0 h-auto",
        item: [
          "w-full",
          "rounded-xl",
          "text-foreground",
          "data-[active=true]:text-primary-foreground",
          "data-[active=true]:bg-primary",
          "data-[active=true]:font-bold",
        ],
      }}
    >
      <NavbarContent>
        <NavbarItem
          className="p-4 h-fit"
          isActive={selectedRoute === "general"}
        >
          <Link
            className="text-white"
            href={`/dashboard/apps/${app.id}/settings/general`}
          >
            General
          </Link>
        </NavbarItem>
        <NavbarItem className="p-4 h-fit" isActive={selectedRoute === "ports"}>
          <Link
            className="text-white"
            href={`/dashboard/apps/${app.id}/settings/ports`}
          >
            Configuración de puertos
          </Link>
        </NavbarItem>
        <NavbarItem
          className="p-4 h-fit"
          isActive={selectedRoute === "domains"}
        >
          <Link
            className="text-white"
            href={`/dashboard/apps/${app.id}/settings/domains`}
          >
            Dominios
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
