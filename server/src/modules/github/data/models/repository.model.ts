import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Repository {
  @Field((type) => ID)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => String, { name: 'fullName' })
  full_name: string;

  @Field((type) => String)
  private: boolean;
}
