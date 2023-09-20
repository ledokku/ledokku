"use client";

import { GithubIcon } from "@/ui/icons/GithubIcon";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { DateTime } from "luxon";
import { Database } from "@/generated/graphql";
import { DbIcon } from "../DbIcon";

interface DatabaseCardProps {
  database: Database;
}

export const DatabaseCard = ({ database }: DatabaseCardProps) => {
  return (
    <Link href={`/database/${database.id}`} className="w-full">
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
              <div style={{ width: 40, height: 40 }}>
                <DbIcon database={database.type} size={40} />
              </div>
            </div>
            <div className="flex flex-col items-start ml-4 w-full">
              <h6 className="text-ellipsis overflow-hidden">{database.name}</h6>
              <p className="text-xs text-foreground-500">{database.id}</p>
            </div>
          </div>
          <p className="text-sm mt-2">
            Creado el{" "}
            {DateTime.fromISO(database.createdAt).toFormat("dd/MM/yyyy")}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
};
