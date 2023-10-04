import { Chip } from "@nextui-org/react";
import { DbTypes } from "@/generated/graphql";
import { dbTypeToReadableName } from "@/utils/utils";
import { DbIcon } from "@/ui/icons/DbIcon";

interface DatabaseVersionBadgeProps {
  database: {
    type: DbTypes;
    version?: string | null;
  };
}

export const DatabaseVersionBadge = ({
  database,
}: DatabaseVersionBadgeProps) => {
  return (
    <div className="w-fit flex items-center mt-1 rounded-full border-2 border-divider justify-center ml-4 pl-2 pr-1 py-1">
      <DbIcon database={database.type} size={16} />
      <p className="mx-2">{dbTypeToReadableName(database.type)}</p>
      <Chip color="primary" size="sm">
        {database.version}
      </Chip>
    </div>
  );
};
