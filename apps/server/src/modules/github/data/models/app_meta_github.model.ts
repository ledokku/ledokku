import { AppMetaGithub as AppMetaGithubClass } from '@prisma/client';
import { Field, ObjectType } from 'type-graphql';
import { GraphQLDateTime } from '../../../../utils';

@ObjectType()
export class AppGithubMeta implements AppMetaGithubClass {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  repoId: string;

  @Field((type) => String)
  repoOwner: string;

  @Field((type) => String)
  repoName: string;

  @Field((type) => String)
  branch: string;

  @Field((type) => String)
  githubAppInstallationId: string;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;
}
