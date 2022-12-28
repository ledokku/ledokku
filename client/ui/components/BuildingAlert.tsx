import { Button, Card, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { App } from "../../generated/graphql";

interface BuildingAlertProps {
    app: App
}

export const BuildingAlert = ({ app }: BuildingAlertProps) => {
    const router = useRouter()

    return <Card className="p-1">
        <div className="animated-gradient"/>
        <Card variant="flat" css={{ 
            borderRadius: "0.7rem"
         }}>
            <div className='px-4 py-2 flex items-center'>
                <div className='ml-4 grow'>
                    <Text h4>{app.name}</Text>
                    El proyecto {app.name} se está compilando, ya puedes ver los registros en tiempo real.
                </div>
                <div>
                    <Button
                        ghost
                        onClick={() => router.push(`/app_build/${app.id}`)}
                        size="sm">
                        Ver registros
                    </Button>
                </div>
            </div>
        </Card>
    </Card>;
}