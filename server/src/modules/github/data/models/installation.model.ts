import { Field, ID, ObjectType } from 'type-graphql';
import { GithubUser } from './github_user.model';

/**
 * Installation
 */
@ObjectType()
export class Installation {
  /**
   * The ID of the installation.
   */
  @Field((type) => ID)
  id: number;
  account: (GithubUser | Enterprise) &
    (((GithubUser | Enterprise) & null) | (GithubUser | Enterprise));
  /**
   * Describe whether all repositories have been selected or there's a selection involved
   */
  repository_selection: 'all' | 'selected';
  access_tokens_url: string;
  repositories_url: string;
  html_url: string;
  app_id: number;
  /**
   * The ID of the user or organization this token is being scoped to.
   */
  target_id: number;
  target_type: string;
  permissions: AppPermissions;
  events: string[];
  created_at: string;
  updated_at: string;
  single_file_name: string | null;
  has_multiple_single_files?: boolean;
  single_file_paths?: string[];
  app_slug: string;
  suspended_by: null | GithubUser;
  suspended_at: string | null;
  contact_email?: string | null;
  [k: string]: unknown;
}

export interface Enterprise {
  /**
   * A short description of the enterprise.
   */
  description?: string | null;
  html_url: string;
  /**
   * The enterprise's website URL.
   */
  website_url?: string | null;
  /**
   * Unique identifier of the enterprise
   */
  id: number;
  node_id: string;
  /**
   * The name of the enterprise.
   */
  name: string;
  /**
   * The slug url identifier for the enterprise.
   */
  slug: string;
  created_at: string | null;
  updated_at: string | null;
  avatar_url: string;
  [k: string]: unknown;
}
/**
 * The permissions granted to the user-to-server access token.
 */
export interface AppPermissions {
  /**
   * The level of permission to grant the access token for GitHub Actions workflows, workflow runs, and artifacts.
   */
  actions?: string;
  /**
   * The level of permission to grant the access token for repository creation, deletion, settings, teams, and collaborators creation.
   */
  administration?: string;
  /**
   * The level of permission to grant the access token for checks on code.
   */
  checks?: string;
  /**
   * The level of permission to grant the access token for repository contents, commits, branches, downloads, releases, and merges.
   */
  contents?: string;
  /**
   * The level of permission to grant the access token for deployments and deployment statuses.
   */
  deployments?: string;
  /**
   * The level of permission to grant the access token for managing repository environments.
   */
  environments?: string;
  /**
   * The level of permission to grant the access token for issues and related comments, assignees, labels, and milestones.
   */
  issues?: string;
  /**
   * The level of permission to grant the access token to search repositories, list collaborators, and access repository metadata.
   */
  metadata?: string;
  /**
   * The level of permission to grant the access token for packages published to GitHub Packages.
   */
  packages?: string;
  /**
   * The level of permission to grant the access token to retrieve Pages statuses, configuration, and builds, as well as create new builds.
   */
  pages?: string;
  /**
   * The level of permission to grant the access token for pull requests and related comments, assignees, labels, milestones, and merges.
   */
  pull_requests?: string;
  /**
   * The level of permission to grant the access token to manage the post-receive hooks for a repository.
   */
  repository_hooks?: string;
  /**
   * The level of permission to grant the access token to manage repository projects, columns, and cards.
   */
  repository_projects?: string;
  /**
   * The level of permission to grant the access token to view and manage secret scanning alerts.
   */
  secret_scanning_alerts?: string;
  /**
   * The level of permission to grant the access token to manage repository secrets.
   */
  secrets?: string;
  /**
   * The level of permission to grant the access token to view and manage security events like code scanning alerts.
   */
  security_events?: string;
  /**
   * The level of permission to grant the access token to manage just a single file.
   */
  single_file?: string;
  /**
   * The level of permission to grant the access token for commit statuses.
   */
  statuses?: string;
  /**
   * The level of permission to grant the access token to manage Dependabot alerts.
   */
  vulnerability_alerts?: string;
  /**
   * The level of permission to grant the access token to update GitHub Actions workflow files.
   */
  workflows?: string;
  /**
   * The level of permission to grant the access token for organization teams and members.
   */
  members?: string;
  /**
   * The level of permission to grant the access token to manage access to an organization.
   */
  organization_administration?: string;
  /**
   * The level of permission to grant the access token for custom roles management. This property is in beta and is subject to change.
   */
  organization_custom_roles?: string;
  /**
   * The level of permission to grant the access token to manage the post-receive hooks for an organization.
   */
  organization_hooks?: string;
  /**
   * The level of permission to grant the access token for viewing an organization's plan.
   */
  organization_plan?: string;
  /**
   * The level of permission to grant the access token to manage organization projects and projects beta (where available).
   */
  organization_projects?: string;
  /**
   * The level of permission to grant the access token for organization packages published to GitHub Packages.
   */
  organization_packages?: string;
  /**
   * The level of permission to grant the access token to manage organization secrets.
   */
  organization_secrets?: string;
  /**
   * The level of permission to grant the access token to view and manage GitHub Actions self-hosted runners available to an organization.
   */
  organization_self_hosted_runners?: string;
  /**
   * The level of permission to grant the access token to view and manage users blocked by the organization.
   */
  organization_user_blocking?: string;
  /**
   * The level of permission to grant the access token to manage team discussions and related comments.
   */
  team_discussions?: string;
  [k: string]: unknown;
}
