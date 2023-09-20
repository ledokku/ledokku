import { FieldResolver, Resolver, Root } from 'type-graphql';
import { App } from '../apps/data/models/app.model';
import { AppRepository } from '../apps/data/repositories/app.repository';
import { AppBuild } from './data/models/app_build.model';

@Resolver(AppBuild)
export class AppBuildResolver {
  constructor(private appRespository: AppRepository) {}

  @FieldResolver((returns) => App)
  app(@Root() appBuild: AppBuild): Promise<App> {
    return this.appRespository.get(appBuild.appId);
  }
}
