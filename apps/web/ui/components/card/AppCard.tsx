"use client";

import { GithubIcon } from "@/ui/icons/GithubIcon";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { DateTime } from "luxon";
import { App } from "@/generated/graphql";

interface AppCardProps {
  app: App;
}

export const AppCard = ({ app }: AppCardProps) => {
  return (
    <Link href={`/dashboard/apps/${app.id}`} className="w-full">
      <Card isHoverable isPressable className="w-full">
        <CardBody>
          <div className="flex w-full items-start">
            <div
              style={{
                width: "auto",
                height: "auto",
                padding: "0.3rem",
              }}
              className="border-2 rounded-lg border-foreground-300"
            >
              {app.appMetaGithub ? (
                <div style={{ width: 40, height: 40 }}>
                  <GithubIcon size={40} />
                </div>
              ) : (
                <Image
                  width={40}
                  height={40}
                  objectFit="cover"
                  src="/dokku.png"
                  alt="dokkuLogo"
                />
              )}
            </div>
            <div className="flex flex-col items-start ml-4 w-full">
              <h6 className="text-ellipsis overflow-hidden">{app.name}</h6>
              <p className="text-xs text-foreground-500">{app.id}</p>
            </div>
          </div>
          <p className="my-2">
            {app.appMetaGithub
              ? `${app.appMetaGithub.repoOwner}/${app.appMetaGithub.repoName}`
              : ""}
          </p>
          <p className="text-sm">
            Creado el {DateTime.fromISO(app.createdAt).toFormat("dd/MM/yyyy")}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
};
