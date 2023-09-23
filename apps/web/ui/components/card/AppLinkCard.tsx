"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import Link from "next/link";
import { FiInfo } from "react-icons/fi";
import { DbIcon } from "../../icons/DbIcon";
import { DatabaseByIdQuery } from "@/generated/graphql";
import { UnlinkDatabaseModal } from "../modals/UnlinkDatabaseModal";
import { useState } from "react";

interface AppLinkCardProps {
  app: DatabaseByIdQuery["database"]["apps"][0];
  database: DatabaseByIdQuery["database"];
}

export const AppLinkCard = ({ database, app }: AppLinkCardProps) => {
  const [showUnlinkModal, setIsUnlinkModalOpen] = useState(false);

  return (
    <>
      <UnlinkDatabaseModal
        isOpen={showUnlinkModal}
        onOpenChange={(isOpen) => {
          setIsUnlinkModalOpen(isOpen);
        }}
        app={app}
        database={showUnlinkModal ? database : undefined}
      />
      <Card fullWidth>
        <CardBody>
          <div className="flex flex-row items-center">
            <DbIcon database={database.type} size={24} />
            <p className="mx-4 text-lg grow font-bold">{app.name}</p>
            <Link href={`/dashboard/apps/${app.id}`}>
              <Button
                className="mr-2"
                isIconOnly
                color="primary"
                size="sm"
                startContent={<FiInfo size={16} />}
              />
            </Link>
            <Button
              color="danger"
              size="sm"
              onClick={() => {
                setIsUnlinkModalOpen(true);
              }}
            >
              Desenlazar
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
