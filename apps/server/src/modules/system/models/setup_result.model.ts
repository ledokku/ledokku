import { Field, ObjectType } from 'type-graphql';
import { GithubAppManifest } from './github_app_manifest.model';

@ObjectType()
export class SetupResult {
  @Field((type) => Boolean)
  canConnectSsh: boolean;

  @Field((type) => String)
  sshPublicKey: string;

  @Field((type) => Boolean)
  isGithubAppSetup: boolean;

  @Field((type) => String)
  githubAppManifest: string;
}
