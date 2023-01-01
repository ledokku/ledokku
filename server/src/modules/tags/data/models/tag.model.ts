import { Tag as TagClass } from '@prisma/client';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Tag implements TagClass {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  name: string;
}
