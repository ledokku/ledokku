import { Field, ObjectType } from 'type-graphql';

export interface Verification {
  verified: boolean;
  reason: string;
  signature?: any;
  payload?: any;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Node {
  sha: string;
  url: string;
  html_url: string;
}

export interface Commit {
  sha: string;
  node_id: string;
  commit: Commit;
  url: string;
  html_url: string;
  comments_url: string;
  author: User;
  committer: User;
  parents: Node[];
}

export interface Links {
  self: string;
  html: string;
}

export interface RequiredStatusChecks {
  enforcement_level: string;
  contexts: any[];
  checks: any[];
}

export interface Protection {
  enabled: boolean;
  required_status_checks: RequiredStatusChecks;
}

@ObjectType()
export class Branch {
  @Field((type) => String)
  name: string;
  commit: Commit;
  _links: Links;
  protected: boolean;
  protection: Protection;
  protection_url: string;
}
