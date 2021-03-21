import { Badge, Container, Flex, Text } from '@chakra-ui/layout';
import { AppMetaGithub } from '../../generated/graphql';
import { GithubIcon } from '../../ui/icons/GithubIcon';

interface AppHeaderInfoProps {
  app: {
    name: string;
    appMetaGithub?: AppMetaGithub | null;
  };
}

export const AppHeaderInfo = ({ app }: AppHeaderInfoProps) => {
  return (
    <Container maxW="5xl" py="5">
      <Text fontSize="md" fontWeight="bold">
        {app.name}
      </Text>
      {app.appMetaGithub ? (
        <Flex mt="1" alignItems="center" color="gray.700">
          <GithubIcon size={16} />
          <Text fontSize="sm" ml="1">
            {app.appMetaGithub.repoOwner}/{app.appMetaGithub.repoName}
          </Text>
          <Badge
            backgroundColor="gray.200"
            borderRadius="base"
            textTransform="none"
            ml="2"
          >
            {app.appMetaGithub.branch}
          </Badge>
        </Flex>
      ) : null}
    </Container>
  );
};
