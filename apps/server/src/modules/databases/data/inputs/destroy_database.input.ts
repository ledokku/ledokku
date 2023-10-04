import { Field, InputType } from 'type-graphql';

@InputType()
export class DestroyDatabaseInput {
  @Field((type) => String)
  databaseId: string;
}
