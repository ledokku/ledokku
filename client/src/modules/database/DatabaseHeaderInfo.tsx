import { Badge, Container, Text } from '@nextui-org/react';
import { DbTypes } from '../../generated/graphql';
import { dbTypeToIcon, dbTypeToReadableName } from '../../pages/utils';

interface DatabaseHeaderInfoProps {
  database: {
    name: string;
    type: DbTypes;
    version?: string | null;
  };
}

export const DatabaseHeaderInfo = ({ database }: DatabaseHeaderInfoProps) => {
  const DbIcon = dbTypeToIcon(database.type);

  return (
    <Container className='mt-8'>
      <div className='flex flex-row items-center'>
        <Text h2>
          {database.name}
        </Text>
        <div className='flex items-center mt-1 rounded-full border-2 border-gray-300 justify-center ml-4 pl-2'>
          <DbIcon size={16} />
          <Text className='mx-2'>
            {dbTypeToReadableName(database.type)}
          </Text>
          <Badge color="primary">
            {database.version}
          </Badge>
        </div>
      </div>
    </Container>
  );
};
