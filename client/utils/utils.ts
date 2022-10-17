import { DbTypes } from '../generated/graphql';

export const dbTypeToDokkuPlugin = (dbType: DbTypes) => {
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

  return '';
};

export const dbTypeToReadableName = (dbType: DbTypes) => {
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


export const isServer = () => typeof window === 'undefined';
