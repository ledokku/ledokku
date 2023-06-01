import { AppByIdQuery } from '@/generated/graphql.server';
import { serverClient } from '@/lib/apollo.server';
import { Pagination } from '@nextui-org/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { useActivityQuery } from '../../../generated/graphql';
import { AdminLayout } from '../../../ui/layout/layout';
import { ActivityItem } from '../../../ui/modules/activity/ActivityFeed';
import { AppHeaderInfo } from '../../../ui/modules/app/AppHeaderInfo';
import { AppHeaderTabNav } from '../../../ui/modules/app/AppHeaderTabNav';

interface ActivityProps {
    app: AppByIdQuery['app'];
}

const ActivityPage = ({ app }: ActivityProps) => {
    const [page, setPage] = useState(1);

    const { data: activityData } = useActivityQuery({
        variables: {
            limit: 10,
            page: page - 1,
            refId: app.id
        },
    });

    return (
        <AdminLayout pageTitle={`Actividad | ${app?.name}`}>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    const res = await serverClient.appById({
        appId: ctx.params?.appId as string
    }, {
        Authorization: `Bearer ${session?.accessToken}`
    });


    return {
        props: {
            app: res.app
        }
    }
}

export default ActivityPage;
