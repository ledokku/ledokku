import { Database as DatabaseClass, DbTypes } from "@prisma/client";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { BasePaginationInfo } from "../../../../data/models/pagination_info";
import { GraphQLDateTime } from "./../../../../utils";

@ObjectType()
export class Database implements DatabaseClass {
  @Field((type) => String)
  id: string;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;

  @Field((type) => String)
  name: string;

  @Field((type) => DbTypes)
  type: DbTypes;

  @Field((type) => String, { nullable: true })
  version: string | null;

  @Field((type) => String)
  userId: string;
}

registerEnumType(DbTypes, {
  name: "DbTypes",
});

@ObjectType()
export class DatabasePaginationInfo extends BasePaginationInfo(Database) {}
