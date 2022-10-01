import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LogPayload {
  @Field((type) => String)
  message: string;

  @Field((type) => String)
  type: string;
}
