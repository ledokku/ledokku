import { Field, InputType } from 'type-graphql';

@InputType()
export class LinkDatabaseInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  databaseId: string;
}
