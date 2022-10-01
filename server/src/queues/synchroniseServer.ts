import { DbTypes } from '@prisma/client';
import { Queue, Worker } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { container } from 'tsyringe';
import { config } from '../config';
import { dbTypeToDokkuPlugin } from '../graphql/utils';
import { DokkuAppRepository } from '../lib/dokku/dokku.app.repository';
import { DokkuDatabaseRepository } from '../lib/dokku/dokku.database.repository';
import { DokkuPluginRepository } from '../lib/dokku/dokku.plugin.repository';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';

const queueName = 'synchronise-server';
const redisClient = new Redis(config.redisUrl);
const plugin = container.resolve(DokkuPluginRepository);
const apps = container.resolve(DokkuAppRepository);
const dokkuDb = container.resolve(DokkuDatabaseRepository);

export const synchroniseServerQueue = new Queue(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * Synchronise the existing dokku settings
 * - apps
 * - databases
 * - links
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const debug = createDebug(`queue:${queueName}:${job.id}`);

    debug(`starting`);

    const users = await prisma.user.findMany({ select: { id: true } });
    // If there are no users on the server it's not necessary to synchronise
    if (users.length === 0) {
      debug(`skipping as there are no users`);
      return;
    }

    const ssh = await sshConnect();

    /**
     * First we synchronise the existing apps
     */
    const dokkuApps = await apps.list(ssh);

    for (const dokkuApp of dokkuApps) {
      // We skip the ledokku application as we don't want to see it in the dashboard
      if (dokkuApp === 'ledokku') {
        continue;
      }

      const apps = await prisma.app.findMany({
        where: { name: dokkuApp },
        select: { name: true },
      });
      const app = apps[0];
      // If app is not in our system we add it
      // otherwise we can continue to the next app
      if (!app) {
        console.log(`=> Added app ${dokkuApp}`);
        await prisma.app.create({
          data: {
            name: dokkuApp,
            type: 'DOKKU',
          },
        });
      }
    }

    /**
     * Then we synchronise the existing databases
     * We also create the links with the existing apps
     */

    const databasesToCheck: DbTypes[] = Object.values(DbTypes);
    const dokkuPlugins = await plugin.list(ssh);

    for (const databaseToCheck of databasesToCheck) {
      // First we check if the db is installed
      const dbDokkuName = dbTypeToDokkuPlugin(databaseToCheck);
      const isDbInstalled =
        dokkuPlugins.plugins.filter((plugin) => plugin.name === dbDokkuName)
          .length !== 0;

      if (!isDbInstalled) {
        debug(`skipping as ${dbDokkuName} is not installed`);
        continue;
      }

      const dokkuDatabases = await dokkuDb.list(ssh, dbDokkuName);

      for (const dokkuDatabase of dokkuDatabases) {
        // We skip the ledokku databases as we don't want to see them in the dashboard
        if (dokkuDatabase === 'ledokku') {
          continue;
        }

        const databases = await prisma.database.findMany({
          where: { name: dokkuDatabase, type: databaseToCheck },
          select: { id: true, name: true },
        });
        let database = databases[0];
        // If database is not in our system we add it
        if (!database) {
          const dokkuDatabaseVersion = await dokkuDb.version(
            ssh,
            dokkuDatabase,
            databaseToCheck
          );

          console.log(`=> Added ${dbDokkuName} database ${dokkuDatabase}`);
          database = await prisma.database.create({
            data: {
              name: dokkuDatabase,
              type: databaseToCheck,
              version: dokkuDatabaseVersion,
            },
          });
        }

        // For each database we need to register the links
        const dokkuLinks = await dokkuDb.links(ssh, dbDokkuName, dokkuDatabase);

        for (const dokkuLink of dokkuLinks) {
          const apps = await prisma.app.findMany({
            where: { name: dokkuLink },
            select: {
              id: true,
              name: true,
              databases: { select: { name: true } },
            },
          });
          const app = apps[0];
          // We check that the app exist for safety but non existing app
          // should never happen ⚡️
          if (
            app &&
            // Check that the app is not already linked to the database
            app.databases.findIndex(
              (database) => database.name === dokkuDatabase
            ) === -1
          ) {
            console.log(
              `=> Linked ${dbDokkuName} database ${dokkuDatabase} with app ${dokkuLink}`
            );
            await prisma.database.update({
              where: { id: database.id },
              data: {
                apps: {
                  connect: { id: app.id },
                },
              },
            });
          }
        }
      }
    }

    debug(`finished`);
    console.log('Finished synchronisation with Dokku');
    ssh.dispose();
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const debug = createDebug(`queue:${queueName}:${job.id}`);

  debug(`failed : ${err.message}`);
  console.error(`${queueName} failed : ${err.message}`);
});
