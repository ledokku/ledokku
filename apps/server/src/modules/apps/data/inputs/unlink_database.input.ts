import { Field, InputType } from 'type-graphql';

@InputType()
export class UnlinkDatabaseInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  databaseId: string;
}
