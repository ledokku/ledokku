import { Roles } from '@prisma/client';
import { ResolverService } from '@tsed/typegraphql';
import { FieldResolver, Query, Mutation, Arg, Authorized } from 'type-graphql';
import { User } from '../../data/models/user';
import { UserRepository } from '../../data/repositories/user_repository';
import { Settings } from './data/models/settings';
import { SettingsRepository } from './data/repositories/settings.repository';

@ResolverService(Settings)
export class SettingsResolver {
  constructor(
    private userRepository: UserRepository,
    private settingsRepository: SettingsRepository
  ) {}

  @Authorized()
  @Query((returns) => Settings)
  async settings() {
    return this.settingsRepository.get();
  }

  @Authorized(Roles.OWNER)
  @Mutation((returns) => String)
  async addAllowedEmail(@Arg('email', (type) => String) email: string) {
    this.settingsRepository.addAllowedEmail(email);

    return email;
  }

  @FieldResolver((returns) => [User])
  async allowedUsers() {
    const settings = await this.settingsRepository.get();
    return this.userRepository.getByEmails(settings.allowedEmails);
  }
}
