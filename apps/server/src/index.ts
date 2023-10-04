import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import 'reflect-metadata';
import { Server } from './server';

async function bootstrap() {
  try {
    $log.info('Start server...');
    const platform = await PlatformExpress.bootstrap(Server, {});
    await platform.listen();
    $log.info('Server initialized');
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
