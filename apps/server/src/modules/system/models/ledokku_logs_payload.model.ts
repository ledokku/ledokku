import { Field, ObjectType } from 'type-graphql';
import { LogPayload } from '../../../data/models/log_payload';

@ObjectType()
export class LedokkuLogsPayload {
  @Field((type) => LogPayload)
  ledokkuLogs: LogPayload;
}
