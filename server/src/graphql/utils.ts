import * as yup from 'yup';
import { DatabaseTypes } from '../generated/graphql';

// Digital ocean token format = exactly 64 chars, lowercase letters & numbers
export const digitalOceanAccessTokenRegExp = /^[a-z0-9]{64}/;

// Validate the name to make sure there are no security risks by adding it to the ssh exec command.
// Only letters and "-" allowed
// TODO unit test this schema
const appNameYup = yup
  .string()
  .required()
  .matches(/^[a-z0-9-]+$/);

export const appNameSchema = yup.object({
  name: appNameYup,
});

export const dbTypeToDokkuPlugin = (dbType: DatabaseTypes): string => {
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
