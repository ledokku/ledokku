import { Text } from '@nextui-org/react';
import { DbTypes } from '../../../generated/graphql';
import { DatabaseVersionBadge } from '../../../ui/components/DatabaseVersionBadge';

interface DatabaseHeaderInfoProps {
  database: {
    name: string;
    type: DbTypes;
    version?: string | null;
  };
}

export const DatabaseHeaderInfo = ({ database }: DatabaseHeaderInfoProps) => {


  return (
    <div className='flex flex-row items-center mt-8'>
      <Text h2>
        {database.name}
      </Text>
      <DatabaseVersionBadge database={database} />
    </div>
  );
};
