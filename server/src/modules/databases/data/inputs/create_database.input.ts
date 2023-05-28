import { DbTypes } from '@prisma/client';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateDatabaseInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  version?: string;

  @Field((type) => String, { nullable: true })
  image?: string;

  @Field((type) => DbTypes)
  type: DbTypes;

  @Field((type) => [String], { nullable: true })
  tags?: string[];
}
