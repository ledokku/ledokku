import { $log } from '@tsed/common';
import { registerProvider } from '@tsed/di';
import { Job, Queue as QueueBull, Worker } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_URL } from '../../constants';

export abstract class IQueue<Args = any, ReturnValue = any> {
  protected queue: QueueBull<Args>;

  add(args: Args): Promise<Job<Args, ReturnValue>> {
    return this.queue.add(this.queue.name, args);
  }

  protected abstract execute(
    job: Job<Args, ReturnValue>
  ): Promise<ReturnValue> | ReturnValue;

  onFailed?(job: Job<Args, ReturnValue>, error: Error): Promise<any> | any;
  onSuccess?(
    job: Job<Args, ReturnValue>,
    result: ReturnValue
  ): Promise<any> | any;
}

interface QueueOptions {
  queueName?: string;
}

export function Queue(options?: QueueOptions) {
  return function <
    Args,
    ReturnValue,
    T extends { new (...args: any[]): IQueue<Args, ReturnValue> }
  >(constructor: T) {
    const redisClient = new Redis(REDIS_URL);

    const queueName = options?.queueName ?? constructor.name;

    const queue = new QueueBull<Args>(queueName, {
      connection: redisClient,
    });

    registerProvider({
      provide: constructor,
      useValue: queue,
    });

    return class extends constructor {
      protected queue: QueueBull<Args> = queue;

      constructor(...args: any[]) {
        super(...args);
        const worker = new Worker(
          queueName,
          async (job) => {
            $log.debug(queueName, job);
            await this.execute(job);
          },
          { connection: redisClient }
        );

        worker.on('failed', async (job, err) => {
          $log.debug(
            `${job.id} has failed on Queue ${constructor.name}:`,
            err.message
          );
          this.onFailed?.call(job, err);
        });

        worker.on(
          'completed',
          (job: Job<Args, ReturnValue>, returnvalue: ReturnValue) =>
            this.onSuccess?.call(job.returnvalue)
        );

        $log.debug(`Queue ${constructor.name} initialized`);
      }

      protected execute(job: Job<Args, ReturnValue>): ReturnValue {
        $log.warn(`No execution implementation on ${constructor.name}`);

        return;
      }
    };
  };
}
