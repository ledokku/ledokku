"use client";

import {
  DatabaseByIdQuery,
  DatabaseInfo,
  DatabaseInfoQuery,
} from "@/generated/graphql";
import { createContext, useContext } from "react";

const DatabaseContext = createContext<{
  database: DatabaseByIdQuery["database"];
  info: DatabaseInfoQuery["databaseInfo"];
} | null>(null);

export const DatabaseProvider = ({
  children,
  database,
  info,
}: {
  children: React.ReactNode;
  database: DatabaseByIdQuery["database"];
  info: DatabaseInfoQuery["databaseInfo"];
}) => {
  return (
    <DatabaseContext.Provider
      value={{
        database,
        info,
      }}
    >
      {children as any}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabaseContext must be used within a DatabaseContext");
  }
  return context;
};
