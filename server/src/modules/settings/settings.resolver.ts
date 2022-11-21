import { ResolverService } from '@tsed/typegraphql';
import { FieldResolver } from 'type-graphql';
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

  @FieldResolver((returns) => [User])
  async allowedUsers() {
    const settings = await this.settingsRepository.get();
    return this.userRepository.getByEmails(settings.allowedEmails);
  }
}
