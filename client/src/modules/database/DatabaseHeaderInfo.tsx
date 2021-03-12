import { Badge, Container, Flex, Text } from '@chakra-ui/layout';
import { DatabaseTypes } from '../../generated/graphql';
import { dbTypeToIcon, dbTypeToReadableName } from '../../pages/utils';

interface DatabaseHeaderInfoProps {
  database: {
    name: string;
    type: DatabaseTypes;
    version?: string | null;
  };
}

export const DatabaseHeaderInfo = ({ database }: DatabaseHeaderInfoProps) => {
  const DbIcon = dbTypeToIcon(database.type);

  return (
    <Container maxW="5xl" py="5">
      <Text fontSize="md" fontWeight="bold">
        {database.name}
      </Text>
      <Flex mt="1" alignItems="center" color="gray.700">
        <DbIcon size={16} />
        <Text fontSize="sm" ml="1">
          {dbTypeToReadableName(database.type)}
        </Text>
        <Badge
          backgroundColor="gray.200"
          borderRadius="base"
          textTransform="none"
          ml="2"
        >
          {database.version}
        </Badge>
      </Flex>
    </Container>
  );
};
