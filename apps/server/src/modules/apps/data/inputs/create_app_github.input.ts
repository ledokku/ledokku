import { Field, ID, InputType } from 'type-graphql';
import { BuildEnvVar } from './build_env_var.input';

@InputType()
export class CreateAppGithubInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  gitRepoFullName: string;

  @Field((type) => String)
  branchName: string;

  @Field((type) => String)
  gitRepoId: string;

  @Field((type) => String, { nullable: true })
  dockerfilePath?: string;

  @Field((type) => String)
  githubInstallationId: string;

  @Field((type) => [BuildEnvVar], { nullable: true })
  envVars?: BuildEnvVar[];

  @Field((type) => [String], { nullable: true })
  tags?: string[];

  @Field((type)=> ID , { nullable: true })
  databaseId?:string;
}
