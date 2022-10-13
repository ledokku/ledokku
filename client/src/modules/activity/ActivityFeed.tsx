import { Divider, Pagination, Text } from "@nextui-org/react";
import format from 'date-fns/format';
import { useState } from "react";
import { Activity, App, useActivityQuery } from "../../generated/graphql";
import { LoadingSection } from "../../ui/components/LoadingSection";

interface Props {
    isSinglePage?: boolean
}

const AppContent = ({ app }: { app: App }) => {
    return <div>{app.name}</div>
}

const ActivityItem = ({ activity }: { activity: Activity }) => {
    return <div>
        <div className="flex flex-row">
            <div className="flex-grow mr-4">
                <Text h4>{activity.name}</Text>
                <Text>{activity.description}</Text>

            </div>
            <Text>{format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm:ss')}</Text>
        </div>
        {activity.reference?.__typename === "App" ? <AppContent app={activity.reference} /> : undefined}
        <Divider y={2} />
    </div>
}

export const ActivityFeed = ({ isSinglePage = false }: Props) => {
    const [page, setPage] = useState(1);

    const { loading, data } = useActivityQuery({
        variables: {
            limit: isSinglePage ? 5 : 10,
            page: page - 1,
        }
    })

    if (loading) {
        return <LoadingSection />
    }

    if (!data) {
        return <Text h4>No hay datos</Text>;
    }



    return <div>
        {
            data.activity.items.map(it => <ActivityItem activity={it as any} />)
        }
        <div className="flex flex-col justify-center items-center mt-8">
            {!isSinglePage ? <Pagination
                page={page} initialPage={1} total={data.activity.totalPages} onChange={setPage} /> : undefined}
        </div>

    </div>
}