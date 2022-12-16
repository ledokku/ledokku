import { DbTypes } from '@prisma/client';
import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { dbTypeToDokkuPlugin } from '../config/utils';
import { UserRepository } from '../data/repositories/user_repository';
import { DokkuAppRepository } from '../lib/dokku/dokku.app.repository';
import { DokkuDatabaseRepository } from '../lib/dokku/dokku.database.repository';
import { DokkuPluginRepository } from '../lib/dokku/dokku.plugin.repository';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { AppRepository } from '../modules/apps/data/repositories/app.repository';
import { DatabaseRepository } from '../modules/databases/data/repositories/database.repository';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';

@Queue()
export class SyncServerQueue extends IQueue {
  constructor(
    private dokkuAppRepository: DokkuAppRepository,
    private dokkuDatabaseRepository: DokkuDatabaseRepository,
    private dokkuPluginRepository: DokkuPluginRepository,
    private appRepository: AppRepository,
    private databaseRepository: DatabaseRepository,
    private userRepository: UserRepository,
    private activityRepository: ActivityRepository
  ) {
    super();
  }

  protected async execute(job: Job<any, any, string>) {
    $log.info(`Iniciando sincronizacion con Dokku`);

    const users = await this.userRepository.getAll();

    if (users.length === 0) {
      $log.info(`No hay usuarios. Saltando sincronizacion`);
      return;
    }

    $log.info(`Sincroninzando aplicaciones`);

    const dokkuApps = await this.dokkuAppRepository.list();

    for (const dokkuApp of dokkuApps) {
      if (dokkuApp === 'ledokku') continue;

      const app = await this.appRepository.getByName(dokkuApp);

      if (!app) {
        await this.appRepository.create(dokkuApp);
      }

      $log.info(`- ${dokkuApp} sincronizado`);
    }

    $log.info(`Sincroninzando bases de datos`);

    const databasesToCheck: DbTypes[] = Object.values(DbTypes);
    const dokkuPlugins = await this.dokkuPluginRepository.list();

    for (const databaseToCheck of databasesToCheck) {
      const pluginName = dbTypeToDokkuPlugin(databaseToCheck);
      const isInstalled =
        dokkuPlugins.plugins.filter((plugin) => plugin.name === pluginName)
          .length !== 0;

      if (!isInstalled) {
        $log.info(`${pluginName} no instalado`);
        continue;
      }

      const dokkuDatabases = await this.dokkuDatabaseRepository.list(
        databaseToCheck
      );

      for (const dokkuDatabase of dokkuDatabases) {
        if (dokkuDatabase === 'ledokku') continue;

        let database = await this.databaseRepository.getByName(
          dokkuDatabase,
          databaseToCheck
        );

        if (!database) {
          const dokkuDatabaseVersion = await this.dokkuDatabaseRepository.version(
            dokkuDatabase,
            databaseToCheck
          );

          database = await this.databaseRepository.create({
            name: dokkuDatabase,
            type: databaseToCheck,
            version: dokkuDatabaseVersion,
          });
        }

        const dokkuLinks = await this.dokkuDatabaseRepository.links(
          databaseToCheck,
          dokkuDatabase
        );

        for (const dokkuLink of dokkuLinks) {
          const app = await this.appRepository.getByName(dokkuLink);

          if (!app) continue;

          const databases = await this.appRepository.databases(app.id);

          if (!!databases.find((database) => database.name === dokkuDatabase)) {
            this.databaseRepository.update(database.id, {
              apps: {
                connect: { id: app.id },
              },
            });
          }
        }

        $log.info(`- ${dokkuDatabase} sincronizado`);
      }
    }

    await this.activityRepository.add({
      name: `Sistema sincronizado`,
    });
  }
}
