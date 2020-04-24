import { ServerTypes } from '../generated/graphql';

export const serverTypeReadableName = (type: ServerTypes) => {
  switch (type) {
    case 'DIGITALOCEAN':
      return 'Digital Ocean';
    case 'AWS':
      return 'AWS';
    case 'LINODE':
      return 'Linode';
    default:
      return type;
  }
};
