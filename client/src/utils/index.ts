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
// Digital ocean token format = exactly 64 chars, lowercase letters & numbers
export const digitalOceanAccessTokenRegExp = /^[a-z0-9]{64}/;
