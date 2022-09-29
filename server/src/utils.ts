import {GraphQLISODateTime} from "type-graphql";

export const GraphQLDateTime = GraphQLISODateTime;


export function throwError(message: string): undefined {
  throw new Error(message);
}
