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

export const dbLinkingGraphQLErrorParse = (
  grapqhlErrorMessage: string,
  isDatabaseView: boolean
) => {
  if (grapqhlErrorMessage.includes('is already linked to an app with id')) {
    return `Your ${
      isDatabaseView ? 'database' : 'app'
    } is already linked to this ${isDatabaseView ? 'app' : 'database'}`;
  }
};
