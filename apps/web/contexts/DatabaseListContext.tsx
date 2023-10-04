"use client";

import { DatabaseQuery } from "@/generated/graphql";
import { createContext, useContext } from "react";

const DatabaseListContext = createContext<
  DatabaseQuery["databases"]["items"] | null
>(null);

export const DatabaseListProvider = ({
  children,
  databases,
}: {
  children: React.ReactNode;
  databases: DatabaseQuery["databases"]["items"];
}) => {
  return (
    <DatabaseListContext.Provider value={databases}>
      {children}
    </DatabaseListContext.Provider>
  );
};

export const useDatabaseListContext = () => {
  const context = useContext(DatabaseListContext);
  if (!context) {
    throw new Error("useDatabaseContext must be used within a DatabaseContext");
  }
  return context;
};
