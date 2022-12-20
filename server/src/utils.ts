import { GraphQLISODateTime } from 'type-graphql';

export const GraphQLDateTime = GraphQLISODateTime;

export function throwError(message: string): undefined {
  throw new Error(message);
}

export function toObjectType<T>(Type: new (...args: any[]) => T, object: T) {
  if (typeof object === 'undefined') return undefined;
  return Object.assign(new Type(), object);
}
