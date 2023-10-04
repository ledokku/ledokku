"use client";

import { AppByIdQuery } from "@/generated/graphql";
import { createContext, useContext } from "react";

const AppContext = createContext<AppByIdQuery["app"] | null>(null);

export const AppProvider = ({
  children,
  app,
}: {
  children: React.ReactNode;
  app: AppByIdQuery["app"];
}) => {
  return (
    <AppContext.Provider value={app}>{children as any}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
