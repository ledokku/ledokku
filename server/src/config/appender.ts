import { Appender, BaseAppender, LogEvent } from '@tsed/logger';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { LedokkuLogsPayload } from '../modules/system/models/ledokku_logs_payload.model';
import { pubsub } from '../server';
const consoleLog = console.log.bind(console);

@Appender({ name: 'publisher_appender' })
export class ConsoleAppender extends BaseAppender {
  write(loggingEvent: LogEvent) {
    console.log(loggingEvent);

    pubsub.publish(SubscriptionTopics.LEDOKKU_LOGS, {
      ledokkuLogs: {
        message: '',
        type: '',
      },
    } as LedokkuLogsPayload);
    consoleLog(this.layout(loggingEvent, this.config.timezoneOffset));
  }
}
