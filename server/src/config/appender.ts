import { Appender, BaseAppender, LogEvent } from '@tsed/logger';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { LedokkuLogsPayload } from '../modules/system/models/ledokku_logs_payload.model';
import { pubsub } from '../server';
const consoleLog = console.log.bind(console);

@Appender({ name: 'publisher_appender' })
export class ConsoleAppender extends BaseAppender {
  write(loggingEvent: LogEvent) {
    pubsub.publish(SubscriptionTopics.LEDOKKU_LOGS, {
      ledokkuLogs: {
        message: loggingEvent.data.join(' '),
        type: loggingEvent.level.levelStr === 'ERROR' ? 'stderr' : 'stdout',
      },
    } as LedokkuLogsPayload);
    consoleLog(this.layout(loggingEvent, this.config.timezoneOffset));
  }
}
