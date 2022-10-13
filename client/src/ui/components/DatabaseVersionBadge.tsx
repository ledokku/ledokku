import { Badge, Text } from "@nextui-org/react";
import { DbTypes } from "../../generated/graphql";
import { dbTypeToIcon, dbTypeToReadableName } from "../../pages/utils";

interface DatabaseVersionBadgeProps {
    database: {
        type: DbTypes,
        version?: string | null
    }
}


export const DatabaseVersionBadge = ({database}: DatabaseVersionBadgeProps) => {
    const DbIcon = dbTypeToIcon(database.type)
    
    return <div className='w-fit flex items-center mt-1 rounded-full border-2 border-gray-300 justify-center ml-4 pl-2'>
    <DbIcon size={16} />
    <Text className='mx-2'>
      {dbTypeToReadableName(database.type)}
    </Text>
    <Badge color="primary">
      {database.version}
    </Badge>
  </div>
}