import { Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Terminal, { TerminalOutput } from "react-terminal-ui";
import { toast } from "react-toastify";
import { LogPayload, useAppByIdQuery, useAppCreateLogsSubscription, useGetCreateLogsQuery } from "../../generated/graphql";
import { AdminLayout } from "../../ui/layout/layout";

const AppBuild = () => {
    const router = useRouter();
    const appId = router.query.appId as string;
    const [arrayOfCreateAppLogs, setArrayOfCreateAppLogs] = useState<LogPayload[]>([]);
    const { data, loading, error } = useAppByIdQuery({
        variables: {
            appId
        }
    })

    const { data: logs, loading: loadingLogs, error: errorLogs } = useGetCreateLogsQuery({
        variables: {
            appId
        }
    })

    useEffect(() => {
        if (logs) {
            setArrayOfCreateAppLogs(logs.createLogs)
        }
    }, [logs])

    useAppCreateLogsSubscription({
        variables: {
            appId
        },
        onSubscriptionData: (data) => {
            const logsExist = data.subscriptionData.data?.appCreateLogs;

            if (logsExist) {
                setArrayOfCreateAppLogs((currentLogs) => {
                    return [...currentLogs, logsExist];
                });
                if (logsExist.type === 'end:success') {
                    toast.success("Aplicación creada")
                } else if (logsExist.type === 'end:failure') {
                    toast.error("Error al crear aplicación")
                }
            }
        },
    });

    return <AdminLayout error={error ?? errorLogs} loading={loading || loadingLogs}>
        <Text className="mb-2">
            Creando la aplicación <b>{data?.app.name}</b> desde{' '}
            <b>{data?.app.appMetaGithub?.repoOwner}/{data?.app.appMetaGithub?.repoName}</b>
        </Text>
        <p className="mb-2">
            Crear una aplicación usualmente toma unos cuantos minutos. Respira un poco,
            los registros aparecerán pronto:
        </p>
        <Terminal>
            {arrayOfCreateAppLogs.map((log, index) => (
                <TerminalOutput key={index}>{log.message}</TerminalOutput>
            ))}
        </Terminal>
    </AdminLayout>
}

export default AppBuild;