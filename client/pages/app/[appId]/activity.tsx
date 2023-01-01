import { Pagination } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useActivityQuery, useAppByIdQuery } from '../../../generated/graphql';
import { AdminLayout } from '../../../ui/layout/layout';
import { ActivityItem } from '../../../ui/modules/activity/ActivityFeed';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';

const ActivityPage = () => {
    const history = useRouter();
    const appId = history.query.appId as string;
    const { data, loading, error } = useAppByIdQuery({
        variables: {
            appId,
        },
        ssr: false,
        skip: !appId,
    });

    const [page, setPage] = useState(1);

    const { loading: loadingActivity, data: activityData, error: activityError } = useActivityQuery({
        variables: {
            limit: 10,
            page: page - 1,
            refId: appId
        },
    });

    const app = data?.app;

    return (
        <AdminLayout loading={loading || loadingActivity} notFound={!app} error={error ?? activityError} pageTitle={`Actividad | ${app?.name}`}>
            {app && <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>}
            <div className='pt-8'>
                {activityData?.activity.items.map((it, index) => (
                    <ActivityItem activity={it as any} key={index} />
                ))}
                <div className="flex flex-col items-center justify-center mt-8">
                    <Pagination
                        page={page}
                        initialPage={1}
                        total={activityData?.activity.totalPages}
                        onChange={setPage}
                    />
                </div>
            </div>
        </AdminLayout>

    );
};

export default ActivityPage;
