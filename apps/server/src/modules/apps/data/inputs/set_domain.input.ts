import { Field, InputType } from 'type-graphql';

@InputType()
export class SetDomainInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  domainName: string;
}
