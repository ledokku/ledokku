import { useToast, UseToastOptions } from '@chakra-ui/react';
import { DatabaseTypes } from '../generated/graphql';

export const dbTypeToDokkuPlugin = (dbType: DatabaseTypes) => {
  switch (dbType) {
    case 'MONGODB':
      return 'mongo';
    case 'POSTGRESQL':
      return 'postgres';
    case 'REDIS':
      return 'redis';
    case 'MYSQL':
      return 'mysql';
  }
};

export const toastConfig = (type: 'error' | 'success'): UseToastOptions => {
  return {
    status: type,
    position: 'top-left',
    duration: 5000,
    isClosable: true,
  };
};
