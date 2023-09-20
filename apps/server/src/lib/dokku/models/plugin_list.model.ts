import { Field, ObjectType } from 'type-graphql';
import { Plugin } from './plugin.model';

@ObjectType()
export class PluginList {
  @Field((type) => String)
  version: string;

  @Field((type) => [Plugin])
  plugins: Plugin[];
}
