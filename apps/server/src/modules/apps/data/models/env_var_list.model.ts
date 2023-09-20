import { Field, ObjectType } from 'type-graphql';
import { EnvVar } from '../../../../lib/dokku/models/env_var.model';

@ObjectType()
export class EnvVarList {
  @Field((type) => [EnvVar])
  envVars: EnvVar[];
}
