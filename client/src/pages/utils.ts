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

export const dbTypeToReadableName = (dbType: DatabaseTypes) => {
  switch (dbType) {
    case 'MONGODB':
      return 'MongoDB';
    case 'POSTGRESQL':
      return 'PostgreSQL';
    case 'REDIS':
      return 'Redis';
    case 'MYSQL':
      return 'MySQL';
  }
};
