import { Field, ObjectType, registerEnumType } from 'type-graphql';

@ObjectType()
export class GithubAppPermissions {
  @Field((type) => String)
  emails: GithubPermission;

  @Field((type) => String)
  contents: GithubPermission;

  @Field((type) => String)
  metadata: GithubPermission;
}

export enum GithubPermission {
  read = 'read',
  write = 'write',
}

registerEnumType(GithubAppPermissions, {
  name: 'GithubPermission',
});
