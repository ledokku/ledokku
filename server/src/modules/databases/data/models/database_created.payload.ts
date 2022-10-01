import { Field, ObjectType } from 'type-graphql';
import { LogPayload } from '../../../../data/models/log_payload';

@ObjectType()
export class DatabaseCreatedPayload {
  @Field((type) => LogPayload)
  createDatabaseLogs: LogPayload;
}
