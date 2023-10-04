"use client";

import Link from "next/link";
import { DbTypes } from "@/generated/graphql";
import { DbIcon } from "@/ui/icons/DbIcon";
import { dbTypeToReadableName } from "@/utils/utils";

interface SourceBoxProps {
  label: string;
  type: DbTypes;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

const SourceBox = ({ label, icon, type, badge, disabled }: SourceBoxProps) => {
  return (
    <Link
      href={`/dashboard/create/database/${type.toLocaleLowerCase()}`}
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
      <h2>Crear base de datos</h2>
      <p className="text-gray-500 text-center">
        Elige el tipo de base de datos que deseas crear.
      </p>
      <div className="flex justify-center items-center grow">
        <div className="grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-center mt-8">
          {Object.values(DbTypes).map((type) => (
            <SourceBox
              key={type}
              label={dbTypeToReadableName(type)}
              type={type}
              icon={<DbIcon size={40} database={type} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
