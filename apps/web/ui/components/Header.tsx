"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FcIdea, FcImport } from "react-icons/fc";
import { OCStudiosLogo } from "../icons/OCStudiosLogo";
import { useState } from "react";

export const Header = () => {
  const location = usePathname();
  const { setTheme, theme } = useTheme();
  const { data } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = data?.user;

  const menuItems: { link: string; name: string }[] = [
    { link: "/dashboard", name: "Inicio" },
    { link: "/dashboard/apps", name: "Aplicaciones" },
    { link: "/dashboard/databases", name: "Bases de datos" },
    { link: "/dashboard/activity", name: "Actividad" },
    { link: "/dashboard/metrics", name: "Metricas" },
    { link: "/dashboard/settings", name: "Configuración" },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      position="sticky"
      isBlurred
      isBordered
      classNames={{
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
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden mr-4"
        />
        <NavbarBrand>
          <Link href="/dashboard">
            <OCStudiosLogo />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden lg:flex">
        {menuItems.map((it, index) => {
          return (
            <NavbarItem key={index} isActive={location === it.link}>
              <Link href={it.link} className="text-inherit">
                {it.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((it, index) => (
          <NavbarMenuItem key={index}>
            <Link color="inherit" href={it.link}>
              <span>{it.name}</span>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" color="primary">
                <Avatar
                  src={user?.image ?? ""}
                  size="sm"
                  className="mr-2"
                  color="default"
                />{" "}
                <span>{user?.name}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                switch (key) {
                  case "logout":
                    signOut({
                      callbackUrl: "/",
                      redirect: true,
                    });
                    break;
                  case "theme":
                    setTheme(theme === "light" ? "dark" : "light");
                    break;
                }
              }}
            >
              <DropdownItem
                startContent={<FcIdea />}
                color="primary"
                key="theme"
              >
                Cambiar tema
              </DropdownItem>
              <DropdownItem
                startContent={<FcImport />}
                color="danger"
                key="logout"
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
