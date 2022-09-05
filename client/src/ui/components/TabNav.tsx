import { HStack, BoxProps, Link } from '@chakra-ui/react';
import { Link as ReactRouterLink, LinkProps } from 'react-router-dom';

export const TabNav = (props: BoxProps) => (
  <HStack
    as="nav"
    spacing="5"
    fontSize="sm"
    lineHeight="5"
    alignItems="baseline"
    {...props}
  />
);

interface TabNavLinkProps extends LinkProps {
  selected?: boolean;
}

export const TabNavLink = ({
  selected,
  ...props
}: TabNavLinkProps & BoxProps) => (
  <Link
    as={ReactRouterLink}
    py="3"
    px="0.5"
    _hover={{
      textDecoration: 'none',
      color: 'black',
    }}
    {...(selected
      ? {
          borderBottom: '2px',
          borderColor: 'black',
          color: 'black',
          mb: '-1px',
        }
      : { color: 'gray.500' })}
    {...props}
  />
);
