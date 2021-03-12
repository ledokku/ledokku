import { DatabaseTypes } from '../generated/graphql';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';

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

export const dbTypeToIcon = (dbType: DatabaseTypes) => {
  switch (dbType) {
    case 'MONGODB':
      return MongoIcon;
    case 'POSTGRESQL':
      return PostgreSQLIcon;
    case 'REDIS':
      return RedisIcon;
    case 'MYSQL':
      return MySQLIcon;
  }
};
