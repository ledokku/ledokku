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

export const debounce = (callBack: any, delay: any) => {
  let timeout: any;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callBack, delay);
  };
};
