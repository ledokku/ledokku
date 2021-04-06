import { Box, BoxProps } from '@chakra-ui/react';

export const Terminal = (props: BoxProps) => (
  <Box
    mt="3"
    p="4"
    boxShadow="lg"
    borderRadius="lg"
    color="gray.100"
    backgroundColor="gray.900"
    fontSize="sm"
    fontFamily="mono"
    lineHeight="1.5"
    style={{ WebkitFontSmoothing: 'auto' }}
    {...props}
  />
);
