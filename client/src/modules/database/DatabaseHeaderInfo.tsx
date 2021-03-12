import { Badge, Container, Flex, Text } from '@chakra-ui/layout';
import { DatabaseTypes } from '../../generated/graphql';
import { dbTypeToReadableName } from '../../pages/utils';
import { PostgreSQLIcon } from '../../ui/icons/PostgreSQLIcon';

interface DatabaseHeaderInfoProps {
  database: {
    name: string;
    type: DatabaseTypes;
    // TODO make it required
    version?: string | null;
  };
}

export const DatabaseHeaderInfo = ({ database }: DatabaseHeaderInfoProps) => {
  return (
    <Container maxW="5xl" py="5">
      <Text fontSize="md" fontWeight="bold">
        {database.name}
      </Text>
      <Flex mt="1" alignItems="center" color="gray.700">
        <PostgreSQLIcon size={16} />
        <Text fontSize="sm" ml="1">
          {dbTypeToReadableName(database.type)}
        </Text>
        <Badge
          backgroundColor="gray.200"
          borderRadius="base"
          textTransform="none"
          ml="2"
        >
          {/* {database.version} */}
          postgres:11.6
        </Badge>
      </Flex>
    </Container>
  );
};
