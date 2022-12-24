import { Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useDatabaseByIdQuery, useDatabaseLogsQuery } from '../../../generated/graphql';
import { Alert } from '../../../ui/components/Alert';
import { LoadingSection } from '../../../ui/components/LoadingSection';
import { Terminal } from '../../../ui/components/Terminal';
import { AdminLayout } from '../../../ui/layout/layout';
import { DatabaseHeaderInfo } from '../../../ui/modules/database/DatabaseHeaderInfo';
import { DatabaseHeaderTabNav } from '../../../ui/modules/database/DatabaseHeaderTabNav';

const Logs = () => {
    const history = useRouter();
    const databaseId = history.query.databaseId as string;

    const { data, loading, error } = useDatabaseByIdQuery({
        variables: {
            databaseId,
        },
    });

    const {
        data: databaseLogsData,
        error: databaseLogsError,
        loading: databaseLogsLoading,
    } = useDatabaseLogsQuery({
        variables: {
            databaseId,
        },
        pollInterval: 15000,
    });

    const database = data?.database;

    return (
        <AdminLayout loading={loading || databaseLogsLoading} error={error ?? databaseLogsError} notFound={!database}>
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

export default Logs;
