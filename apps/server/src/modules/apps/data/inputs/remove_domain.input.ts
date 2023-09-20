import { Field, InputType } from 'type-graphql';

@InputType()
export class RemoveDomainInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  domainName: string;
}
