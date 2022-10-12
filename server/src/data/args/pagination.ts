import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Field((type) => Int)
  page: number = 0;

  @Field((type) => Int)
  limit: number = 10;
}
