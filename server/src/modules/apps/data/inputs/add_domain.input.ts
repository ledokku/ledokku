import { Field, InputType } from 'type-graphql';

@InputType()
export class AddDomainInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  domainName: string;
}
