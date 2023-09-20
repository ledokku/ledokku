"use client";

import { Pagination } from "@nextui-org/react";
import { useState } from "react";
import { useActivityQuery } from "@/generated/graphql";
import { ActivityItem } from "@/ui/modules/activity/ActivityFeed";
import { PageProps } from "@/types/next";

const ActivityPage = ({ params }: PageProps) => {
  const [page, setPage] = useState(1);

  const { data, previousData } = useActivityQuery({
    variables: {
      limit: 10,
      page: page - 1,
      refId: params.appId,
    },
  });

  const optimisticData = data ?? previousData;

  return (
    <div className="w-full">
      {optimisticData?.activity.items.map((it, index) => (
        <ActivityItem activity={it as any} key={index} />
      )) ?? []}
      <div className="flex flex-col items-end justify-center mt-8">
        <Pagination
          page={page}
          initialPage={1}
          total={optimisticData?.activity.totalPages ?? 0}
          onChange={setPage}
        />
      </div>
    </div>
  );
};

export default ActivityPage;
