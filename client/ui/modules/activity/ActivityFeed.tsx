import { Avatar, Divider, Pagination, Text } from '@nextui-org/react';
import format from 'date-fns/format';
import { useState } from 'react';
import { Activity, App, useActivityQuery } from '../../../generated/graphql';
import { LoadingSection } from '../../../ui/components/LoadingSection';

interface Props {
    isSinglePage?: boolean;
}

const AppContent = ({ app }: { app: App }) => {
    return <div>{app.name}</div>;
};

function generateLink(activity: Activity) {
    switch (activity.reference?.__typename) {
        case "App": return `/app/${activity.reference.id}`
        case "Database": return `/database/${activity.reference.id}`
    }

    return "#!"
}

export const ActivityItem = ({ activity }: { activity: Activity }) => {
    console.log(activity);

    return (
        <a href={activity.reference ? generateLink(activity) : "#!"}>
            <div>
                <div className="flex flex-row">
                    <div className="flex-grow mr-4">
                        <Text h4>{activity.name}</Text>
                        <Text>{activity.description}</Text>
                    </div>
                    <div className='flex flex-col items-end'>
                        <Text>{format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm:ss')}</Text>
                        {activity.modifier && <div className='flex mt-4'>
                            <Avatar className='mr-2' size={'sm'} src={activity.modifier?.avatarUrl} />
                            {activity.modifier?.username}
                        </div>
                        }
                    </div>
                </div>
                <Divider y={2} />
            </div>
        </a>
    );
};

export const ActivityFeed = ({ isSinglePage = false }: Props) => {
    const [page, setPage] = useState(1);

    const { loading, data } = useActivityQuery({
        variables: {
            limit: isSinglePage ? 5 : 10,
            page: page - 1,
        },
    });

    if (loading) {
        return <LoadingSection />;
    }

    if (!data || data.activity.totalItems === 0) {
        return <Text h4>No hay datos</Text>;
    }

    return (
        <div>
            {data.activity.items.map((it, index) => (
                <ActivityItem activity={it as any} key={index} />
            ))}
            <div className="flex flex-col justify-center items-center mt-8">
                {!isSinglePage ? (
                    <Pagination
                        page={page}
                        initialPage={1}
                        total={data.activity.totalPages}
                        onChange={setPage}
                    />
                ) : undefined}
            </div>
        </div>
    );
};
