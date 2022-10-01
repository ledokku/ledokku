import { Field, ObjectType } from 'type-graphql';
import { LogPayload } from '../../../../data/models/log_payload';

@ObjectType()
export class DatabaseLinkPayload {
  @Field((type) => LogPayload)
  linkDatabaseLogs: LogPayload;
}
