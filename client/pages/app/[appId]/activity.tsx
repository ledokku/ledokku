import { Pagination } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useActivityQuery, useAppByIdQuery } from '../../../generated/graphql';
import { LoadingSection } from '../../../ui/components/LoadingSection';
import { AdminLayout } from '../../../ui/layout/layout';
import { ActivityItem } from '../../../ui/modules/activity/ActivityFeed';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';

interface EnvFormProps {
    name: string;
    value: string;
    appId: string;
    isNewVar?: boolean;
}

const ActivityPage = () => {
    const history = useRouter();
    const appId = history.query.appId as string;
    const { data, loading } = useAppByIdQuery({
        variables: {
            appId,
        },
        ssr: false,
        skip: !appId,
    });

    const [page, setPage] = useState(1);

    const { loading: loadingActivity, data: activityData } = useActivityQuery({
        variables: {
            limit: 10,
            page: page - 1,
            refId: appId
        },
    });

    if (!data) {
        return null;
    }

    if (!activityData) {
        return null;
    }

    if (loading || loadingActivity) {
        return <LoadingSection />;
    }

    const { app } = data;

    if (!app) {
        return <p>App not found.</p>;
    }

    return (
        <AdminLayout>
            <div>
                <AppHeaderInfo app={app} />
                <AppHeaderTabNav app={app} />
            </div>
            <div className='pt-8'>
                {activityData.activity.items.map((it, index) => (
                    <ActivityItem activity={it as any} key={index} />
                ))}
                <div className="flex flex-col justify-center items-center mt-8">
                    <Pagination
                        page={page}
                        initialPage={1}
                        total={activityData.activity.totalPages}
                        onChange={setPage}
                    />
                </div>
            </div>
        </AdminLayout>

    );
};

export default ActivityPage;
