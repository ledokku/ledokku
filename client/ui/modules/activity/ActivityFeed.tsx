import { Avatar, Divider, Pagination, Text } from '@nextui-org/react';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import TinyCrossfade from 'react-tiny-crossfade';
import { Activity, useActivityQuery } from '../../../generated/graphql';
import { LoadingSection } from '../../../ui/components/LoadingSection';

interface Props {
    isSinglePage?: boolean;
}

function generateLink(activity: Activity) {
    switch (activity.reference?.__typename) {
        case "App": return `/app/${activity.reference.id}`
        case "Database": return `/database/${(activity.reference as any).dbId}`
    }

    return "#!"
}

export const ActivityItem = ({ activity }: { activity: Activity }) => {
    return (
        <a href={activity.reference ? generateLink(activity) : "#!"}>
            <div>
                <div className="flex flex-row">
                    <div className="flex-grow mr-4">
                        <Text h5>{activity.name}</Text>
                        <Text className='text-sm'>{activity.description}</Text>
                    </div>
                    <div className='flex flex-col items-end'>
                        <Text className='text-sm'>{format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm:ss')}</Text>
                        {activity.modifier && <div className='flex mt-2 text-sm'>
                            <Avatar className='mr-2' size={'xs'} src={activity.modifier?.avatarUrl} />
                            {activity.modifier?.username}
                        </div>}
                    </div>
                </div>
                <Divider y={1} />
            </div>
        </a>
    );
};

export const ActivityFeed = ({ isSinglePage = false }: Props) => {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const { loading, data } = useActivityQuery({
        variables: {
            limit: isSinglePage ? 5 : 10,
            page: page - 1,
        },
    });

    useEffect(() => {
        if (data) {
            setTotal(data.activity.totalPages)
        }
    }, [data])

    return (
        <>
            <TinyCrossfade className='component-wrapper' disableInitialAnimation>
                {loading ?
                    <LoadingSection key="loading" /> :
                    !data || data.activity.totalItems === 0 ?
                        <Text h4 key="notFound" color='gray'>No hay datos</Text> :
                        <div key='content'>
                            {data.activity.items.map((it, index) => (
                                <ActivityItem activity={it as any} key={index} />
                            ))}

                        </div>}
            </TinyCrossfade>
            <div className="flex flex-col justify-center items-center mt-8">
                {!isSinglePage ? (
                    <Pagination
                        page={page}
                        initialPage={1}
                        total={total}
                        onChange={setPage}
                    />
                ) : undefined}
            </div>
        </>
    );
};
