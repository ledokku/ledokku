"use client";

import { Avatar, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Activity, useActivityQuery } from "@/generated/graphql";
import { LoadingSection } from "@/ui/components/LoadingSection";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

interface Props {
  isSinglePage?: boolean;
}

function generateLink(activity: Activity) {
  switch (activity.reference?.__typename) {
    case "App":
      return `/dashboard/apps/${activity.reference.id}`;
    case "Database":
      return `/database/${(activity.reference as any).dbId}`;
  }

  return "#!";
}

export const ActivityItem = ({ activity }: { activity: Activity }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onClick={(e) => {
        router.push(generateLink(activity));
      }}
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between hover:bg-foreground-100 border-b px-2 py-2 border-divider overflow-hidden">
        <div className="mr-4 md:max-w-[70%]">
          <h5 className="!font-semibold">{activity.name}</h5>
          <div
            className={`text-sm hover:bg-foreground-200 w-full ${
              isExpanded
                ? "max-h-full cursor-n-resize"
                : "max-h-12 overflow-hidden cursor-s-resize"
            }`}
            onClick={(e) => {
              setIsExpanded(!isExpanded);
              e.stopPropagation();
            }}
          >
            <cite className="text-foreground-500 w-full whitespace-pre-wrap">
              {activity.description}
            </cite>
          </div>
        </div>

        <div className="flex flex-col w-fit">
          <p className="text-sm">
            {DateTime.fromISO(activity.createdAt).toFormat(
              "dd/MM/yyyy HH:mm:ss"
            )}
          </p>
          {activity.modifier && (
            <div className="flex mt-2 text-sm items-center">
              <Avatar
                className="mr-2"
                size="sm"
                src={activity.modifier?.avatarUrl}
              />
              {activity.modifier?.username}
            </div>
          )}
        </div>
      </div>
    </div>
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
      setTotal(data.activity.totalPages);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <LoadingSection />
      ) : !data || data.activity.totalItems === 0 ? (
        <p className="text-gray-400 text-xl">No hay datos</p>
      ) : (
        <div className="border-t border-divider">
          {data.activity.items.map((it, index) => (
            <ActivityItem activity={it as any} key={index} />
          ))}
        </div>
      )}
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
