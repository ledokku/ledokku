import { Field, ObjectType } from 'type-graphql';
import { LogPayload } from '../../../../models/log_payload';

@ObjectType()
export class AppRebuildPayload {
  @Field((type) => LogPayload)
  appRebuildLogs: LogPayload;
}
