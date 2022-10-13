import { ClassType, Field, Int, ObjectType } from 'type-graphql';

export function BasePaginationInfo<T extends ClassType>(clazz: T) {
  @ObjectType({ isAbstract: true })
  class BasePaginationInfo {
    @Field((type) => [clazz])
    items: T[];

    @Field((type) => Int)
    page: number;

    @Field((type) => Int, { nullable: true })
    nextPage?: number | null;

    @Field((type) => Int, { nullable: true })
    prevPage?: number | null;

    @Field((type) => Int)
    totalItems: number;

    @Field((type) => Int)
    totalPages: number;
  }

  return BasePaginationInfo;
}
