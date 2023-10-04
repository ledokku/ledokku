import { Field, InputType } from 'type-graphql';

@InputType()
export class BuildEnvVar {
  @Field((type) => String)
  key: string;

  @Field((type) => String)
  value: string;

  @Field((type) => Boolean, { nullable: true })
  asBuildArg?: boolean;
}
