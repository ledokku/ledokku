export type GithubPagination<Key extends string, T> = {
  [child in Key]: T[];
} & {
  total_count: number;
  [k: string]: unknown;
};
