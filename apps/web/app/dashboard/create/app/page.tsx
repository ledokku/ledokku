"use client";

import { Chip } from "@nextui-org/react";
import { DockerIcon } from "@/ui/icons/DockerIcon";
import { GithubIcon } from "@/ui/icons/GithubIcon";
import Link from "next/link";
import { AppTypes } from "@/generated/graphql";

interface SourceBoxProps {
  label: string;
  type: AppTypes;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

const SourceBox = ({ label, icon, type, badge, disabled }: SourceBoxProps) => {
  return (
    <Link
      href={`/dashboard/create/app/${type}`}
      className={disabled ? "pointer-events-none" : ""}
    >
      <div
        className={`w-full h-full border-solid px-16 py-12 flex flex-col border-3 items-center justify-center rounded-2xl ${
          !disabled
            ? `grayscale-0 opacity-100 cursor-pointer hover:bg-[#7a7a7a1f]`
            : "grayscale-1 opacity-50 border-gray-600"
        }`}
      >
        <div className="h-12 mb-2">{icon}</div>
        <h3>{label}</h3>
        {badge}
      </div>
    </Link>
  );
};

export default function CreateApp() {
  return (
    <div className="h-full flex flex-col items-center">
      <h2>Crear aplicación</h2>
      <p className="text-gray-500 text-center">
        Elige entre crear una aplicación desde un repositorio de Github o una
        aplicación de Dokku.
      </p>
      <div className="flex justify-center items-center grow">
        <div className="grow grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 justify-center mt-8">
          <SourceBox
            label="GitHub"
            type={AppTypes.Github}
            icon={<GithubIcon size={40} />}
          />
          <SourceBox
            label="Docker"
            type={AppTypes.Docker}
            icon={<DockerIcon size={40} />}
            disabled
            badge={<Chip color="danger">Proximamente</Chip>}
          />
        </div>
      </div>
    </div>
  );
}
