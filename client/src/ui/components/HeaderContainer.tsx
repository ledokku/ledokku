import { chakra } from '@chakra-ui/system';

interface HeaderContainerProps {
  children: React.ReactNode;
}

export const HeaderContainer = ({ children }: HeaderContainerProps) => {
  return (
    <chakra.div
      backgroundColor="gray.50"
      borderBottom="1px"
      borderColor="gray.200"
    >
      {children}
    </chakra.div>
  );
};
