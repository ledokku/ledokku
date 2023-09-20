import { Field, ID, ObjectType } from 'type-graphql';
import { LogPayload } from '../../../../data/models/log_payload';

@ObjectType()
export class AppCreatedPayload {
  @Field((type) => ID)
  appId: string;

  @Field((type) => LogPayload)
  appCreateLogs: LogPayload;
}
