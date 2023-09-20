import { Button, Card } from "@nextui-org/react";
import { App } from "../../generated/graphql";
import Link from "next/link";

interface BuildingAlertProps {
  app: App;
}

export const BuildingAlert = ({ app }: BuildingAlertProps) => {
  return (
    <Card className="p-1 shadow-2xl">
      <div className="animated-gradient" />
      <Card className="rounded-xl">
        <div className="px-4 py-2 flex items-center">
          <div className="ml-4 grow">
            <h4>{app.name}</h4>
            El proyecto {app.name} se está compilando, ya puedes ver los
            registros en tiempo real.
          </div>
          <div>
            <Button
              variant="ghost"
              as={Link}
              href={`/app_build/${app.id}`}
              size="sm"
            >
              Ver registros
            </Button>
          </div>
        </div>
      </Card>
    </Card>
  );
};
