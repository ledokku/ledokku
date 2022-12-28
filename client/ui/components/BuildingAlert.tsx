import { Button, Card, Loading, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { App } from "../../generated/graphql";

interface BuildingAlertProps {
    app: App
}

export const BuildingAlert = ({ app }: BuildingAlertProps) => {
    const router = useRouter()

    return <Card css={{ backgroundColor: "$primary" }}>
        <div className='px-4 py-2 flex'>
            <div>
                <Loading color="white" />
            </div>
            <div className='ml-4 grow text-white'>
                <Text h4 className='text-white'>Proyecto {app.name} construyendose</Text>
                El proyecto {app.name} se está compilando, ya puedes ver los registros en tiempo real.
            </div>
            <div className='self-end'>
                <Button
                    ghost
                    onClick={() => router.push(`/app_build/${app.id}`)}
                    className='text-white border-white'
                    size="sm">
                    Ver registros
                </Button>
            </div>
        </div>
    </Card>;
}