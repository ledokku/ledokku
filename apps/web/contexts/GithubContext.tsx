"use client";

import { AppsQuery, RepositoriesQuery } from "@/generated/graphql";
import { createContext, useContext } from "react";

const GithubContext = createContext<{
  apps: AppsQuery["apps"]["items"];
  installationId: string;
  repositories: RepositoriesQuery["repositories"];
} | null>(null);

export const GithubProvider = ({
  children,
  apps,
  installationId,
  repositories,
}: {
  children: React.ReactNode;
  apps: AppsQuery["apps"]["items"];
  installationId: string;
  repositories: RepositoriesQuery["repositories"];
}) => {
  return (
    <GithubContext.Provider
      value={{
        apps,
        installationId,
        repositories,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGithubContext = () => {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
