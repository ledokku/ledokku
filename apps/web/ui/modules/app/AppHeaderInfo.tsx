"use client";

import { Card, CardBody, Chip, Link, Spacer, Spinner } from "@nextui-org/react";
import { GithubIcon } from "@/ui/icons/GithubIcon";
import { BuildingAlert } from "@/ui/components/BuildingAlert";
import { AppByIdQuery, AppStatus } from "@/generated/graphql.server";

interface AppHeaderInfoProps {
  app: AppByIdQuery["app"];
  domains: string[];
}

export const AppHeaderInfo = ({ app, domains }: AppHeaderInfoProps) => {
  return (
    <>
      {app?.status === AppStatus.Building && (
        <>
          <BuildingAlert app={app as any} />
          <Spacer />
        </>
      )}
      <div className="flex justify-between md:items-end flex-col md:flex-row gap-4">
        <h2>{app.name}</h2>
        <div className="flex flex-col md:items-end gap-2">
          {app.appMetaGithub ? (
            <Link
              href={`https://github.com/${app.appMetaGithub.repoOwner}/${app.appMetaGithub.repoName}/tree/${app.appMetaGithub.branch}`}
              target="_blank"
            >
              <Card>
                <CardBody className="px-4 py-2">
                  <div className="flex flex-row items-center">
                    <GithubIcon size={24} />
                    <p className="mx-4">
                      {app.appMetaGithub.repoOwner}/{app.appMetaGithub.repoName}
                    </p>
                    <Chip color="primary">{app.appMetaGithub.branch}</Chip>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ) : null}

          <Link href={`http://${domains?.at(0)}`} isExternal target="_blank">
            {domains?.at(0)}
          </Link>
        </div>
      </div>
    </>
  );
};
