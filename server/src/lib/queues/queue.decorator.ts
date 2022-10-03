import { $log } from '@tsed/common';
import { Job, Queue as QueueBull, Worker } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_URL } from '../../constants';

export abstract class IQueue<Args = any, ReturnValue = any> {
  protected queue: QueueBull<Args>;
  protected worker: Worker<Args, ReturnValue>;

  add(args?: Args): Promise<Job<Args, ReturnValue>> {
    return this.queue.add(this.queue.name, args);
  }

  protected execute(
    job: Job<Args, ReturnValue, string>
  ): ReturnValue | Promise<ReturnValue> {
    throw new Error(`Queue ${this.constructor.name} not implemented`);
  }

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
    const redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
    });

    const queueName = options?.queueName ?? constructor.name;

    const bullQueue = new QueueBull<Args>(queueName, {
      connection: redisClient,
    });

    return class extends constructor {
      protected queue: QueueBull<Args, any, string> = bullQueue;

      constructor(...args: any[]) {
        super(...args);

        this.worker = new Worker(
          queueName,
          async (job) => {
            $log.info(queueName, 'new job ID:', job.id);
            return await this.execute(job);
          },
          { connection: redisClient }
        );

        this.worker.on('failed', async (job, err) => {
          $log.info(
            `${job.id} has failed on Queue ${constructor.name}:`,
            err.message
          );
          this.onFailed?.call(job, err);
        });

        this.worker.on(
          'completed',
          (job: Job<Args, ReturnValue>, returnvalue: ReturnValue) =>
            this.onSuccess?.call(job, returnvalue)
        );

        $log.info(`Queue ${constructor.name} initialized`);
      }
    };
  };
}
