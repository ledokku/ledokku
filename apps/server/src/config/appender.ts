import { Appender, BaseAppender, LogEvent } from '@tsed/logger';
import { LogPayload } from '../data/models/log_payload';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { LedokkuLogsPayload } from '../modules/system/models/ledokku_logs_payload.model';
import { pubsub } from '../server';
const consoleLog = console.log.bind(console);

export const ledokkuLogs: LogPayload[] = [];

@Appender({ name: 'publisher_appender' })
export class ConsoleAppender extends BaseAppender {
  write(loggingEvent: LogEvent) {
    const payload = {
      ledokkuLogs: {
        message: this.layout(loggingEvent, this.config.timezoneOffset),
        type: loggingEvent.level.levelStr === 'ERROR' ? 'stderr' : 'stdout',
      },
    } as LedokkuLogsPayload;

    pubsub.publish(SubscriptionTopics.LEDOKKU_LOGS, payload);

    if (ledokkuLogs.length > 20) {
      ledokkuLogs.shift();
    }
    ledokkuLogs.push(payload.ledokkuLogs);

    consoleLog(this.layout(loggingEvent, this.config.timezoneOffset));
  }
}
