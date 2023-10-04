"use client";

import { useDatabaseContext } from "@/contexts/DatabaseContext";
import { DatabaseVersionBadge } from "./DatabaseVersionBadge";

export const DatabaseHeaderInfo = () => {
  const {database} = useDatabaseContext();

  return (
    <div className="flex flex-row items-center justify-between mt-8">
      <h2>{database.name}</h2>
      <DatabaseVersionBadge database={database} />
    </div>
  );
};
