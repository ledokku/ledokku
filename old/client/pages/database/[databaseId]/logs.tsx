import { DatabaseByIdQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Text } from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useDatabaseLogsQuery } from '../../../generated/graphql';
import { Alert } from '../../../ui/components/Alert';
import { LoadingSection } from '../../../ui/components/LoadingSection';
import { Terminal } from '../../../ui/components/Terminal';
import { AdminLayout } from '../../../ui/layout/layout';
import { DatabaseHeaderInfo } from '../../../ui/modules/database/DatabaseHeaderInfo';
import { DatabaseHeaderTabNav } from '../../../ui/modules/database/DatabaseHeaderTabNav';

interface LogsProps {
    database: DatabaseByIdQuery['database'];
}

const Logs = ({ database }: LogsProps) => {
    const {
        data: databaseLogsData,
        error: databaseLogsError,
        loading: databaseLogsLoading,
        startPolling
    } = useDatabaseLogsQuery({
        variables: {
            databaseId: database.id,
        },
    });

    useEffect(() => {
        startPolling(1000);
    }, [startPolling]);


    return (
        <AdminLayout pageTitle={`Registros | ${database?.name}`}>
            {database && <>
                <div>
                    <DatabaseHeaderInfo database={database} />
                    <DatabaseHeaderTabNav database={database} />
                </div>
                <Text h3 className="my-8">
                    Registros de la base de datos &quot;{database.name}&quot;:
                </Text>

                {databaseLogsLoading ? <LoadingSection /> : null}

                {databaseLogsError ? <Alert type="error" message={databaseLogsError.message} /> : null}

                {!databaseLogsLoading && !databaseLogsError && databaseLogsData ? (
                    <Terminal>
                        {databaseLogsData.databaseLogs.logs.map((dblog, index) => (
                            <React.Fragment key={index}>
                                {dblog ? <p>{dblog}</p> : <p>&nbsp;</p>}
                            </React.Fragment>
                        ))}
                    </Terminal>
                ) : null}
            </>}
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    const database = await serverClient.databaseById({
        databaseId: ctx.params?.databaseId as string
    }, {
        "Authorization": `Bearer ${session?.accessToken}`
    })


    return {
        props: {
            database: database.database,
        }
    }
}

export default Logs;
