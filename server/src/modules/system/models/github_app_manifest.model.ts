import { Field, ObjectType } from 'type-graphql';
import { GithubAppPermissions } from './github_app_permissions.model';
import { GithubHookAttributes } from './github_hook_attributes.model';

@ObjectType()
export class GithubAppManifest {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  url: string;

  @Field((type) => String)
  request_oauth_on_install: boolean;

  @Field((type) => String)
  callback_url: string;

  @Field((type) => GithubHookAttributes)
  hook_attributes: GithubHookAttributes;

  @Field((type) => String)
  redirect_url: string;

  @Field((type) => String)
  public: boolean;

  @Field((type) => GithubAppPermissions)
  default_permissions: GithubAppPermissions;

  @Field((type) => [String])
  default_events: string[];
}
