import { DbTypes } from '../generated/graphql';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';

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

export const dbTypeToIcon = (dbType: DbTypes) => {
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