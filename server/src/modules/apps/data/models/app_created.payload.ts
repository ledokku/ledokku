import { Field, ObjectType } from 'type-graphql';
import { LogPayload } from '../../../../data/models/log_payload';

@ObjectType()
export class AppCreatedPayload {
  @Field((type) => LogPayload)
  appCreateLogs: LogPayload;
}
