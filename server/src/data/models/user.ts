import { Roles, User as UserClass } from '@prisma/client';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { GraphQLDateTime } from '../../utils';

@ObjectType()
export class User implements UserClass {
  @Field((type) => ID)
  id: string;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;

  @Field((type) => String)
  username: string;

  @Field((type) => String)
  avatarUrl: string;

  @Field((type) => String)
  email: string;

  @Field((type) => String)
  githubId: string;

  @Field((type) => String)
  githubAccessToken: string;

  @Field((type) => String)
  refreshToken: string;

  @Field((type) => GraphQLDateTime)
  refreshTokenExpiresAt: Date;

  @Field((type) => Roles)
  role: Roles;
}

registerEnumType(Roles, {
  name: 'Roles',
});
