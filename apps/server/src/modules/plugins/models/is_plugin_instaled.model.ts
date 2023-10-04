import { Field, ObjectType } from 'type-graphql';

//TODO: innecesario
@ObjectType()
export class IsPluginInstalled {
  @Field()
  isPluginInstalled: boolean;
}
